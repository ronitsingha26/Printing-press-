const { validationResult } = require("express-validator");
const pool = require("../config/db");
const { generateQuotationPDF } = require("../utils/pdfGenerator");

function badRequest(res, errors) {
  return res.status(400).json({ message: "Validation error", errors });
}

async function getPricingByGsm(gsm) {
  const [rows] = await pool.query(
    "SELECT id, gsm, paper_rate_per_sqm, bw_rate, color_rate, wastage_pct, profit_pct FROM pricing_rules WHERE gsm = ? LIMIT 1",
    [gsm]
  );
  return rows[0] || null;
}

async function getFinishingRates(finishingIds) {
  if (!finishingIds || !Array.isArray(finishingIds) || !finishingIds.length) {
    return { total: 0, names: [] };
  }
  const ids = finishingIds.map((x) => Number(x)).filter((n) => Number.isFinite(n));
  if (!ids.length) return { total: 0, names: [] };

  const [rows] = await pool.query(
    `SELECT id, name, rate FROM finishing_options WHERE id IN (${ids
      .map(() => "?")
      .join(",")})`,
    ids
  );
  const total = rows.reduce((s, r) => s + Number(r.rate || 0), 0);
  const names = rows.map((r) => r.name);
  return { total, names };
}

function calcCosts({
  sheet_width,
  sheet_height,
  print_type,
  color_type,
  quantity,
  wastage_pct,
  profit_pct,
  pricingRule,
  finishingCost,
  gst_applied,
}) {
  const width_mm = Number(sheet_width);
  const height_mm = Number(sheet_height);
  const qty = Number(quantity);

  const sheetArea = (width_mm / 1000) * (height_mm / 1000);
  const paperCost = Number(pricingRule.paper_rate_per_sqm) * sheetArea * qty;
  const sides = print_type === "double" ? 2 : 1;
  const rate =
    color_type === "color"
      ? Number(pricingRule.color_rate)
      : Number(pricingRule.bw_rate);
  const printCost = rate * qty * sides;
  const wastageCost = (paperCost + printCost) * (Number(wastage_pct) / 100);
  const subtotal = paperCost + printCost + wastageCost + Number(finishingCost || 0);
  const profit = subtotal * (Number(profit_pct) / 100);
  const gst = gst_applied ? (subtotal + profit) * 0.18 : 0;
  const finalPrice = subtotal + profit + gst;

  return {
    sheetArea,
    paperCost,
    printCost,
    wastageCost,
    finishingCost: Number(finishingCost || 0),
    subtotal,
    profit,
    gst,
    finalPrice,
  };
}

async function listJobs(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT j.*, c.name AS customer_name
       FROM jobs j
       LEFT JOIN customers c ON c.id = j.customer_id
       ORDER BY j.id DESC`
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

async function createJob(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return badRequest(res, result.array());

    const {
      customer_id,
      gsm,
      sheet_width,
      sheet_height,
      num_sheets,
      print_type,
      color_type,
      quantity,
      wastage_pct,
      finishing_ids,
      gst_applied,
    } = req.body;

    const pricingRule = await getPricingByGsm(gsm);
    if (!pricingRule) {
      return res.status(400).json({ message: "No pricing rule for this GSM" });
    }

    const effectiveWastage =
      wastage_pct === undefined || wastage_pct === null
        ? Number(pricingRule.wastage_pct)
        : Number(wastage_pct);

    const { total: finishingCost } = await getFinishingRates(finishing_ids);

    const costs = calcCosts({
      sheet_width,
      sheet_height,
      print_type,
      color_type,
      quantity,
      wastage_pct: effectiveWastage,
      profit_pct: Number(pricingRule.profit_pct),
      pricingRule,
      finishingCost,
      gst_applied: Boolean(gst_applied),
    });

    const [r] = await pool.query(
      `INSERT INTO jobs
       (customer_id, gsm, sheet_width, sheet_height, num_sheets, print_type, color_type, quantity, wastage_pct, finishing_ids,
        paper_cost, print_cost, wastage_cost, finishing_cost, profit, gst, final_price, status, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        customer_id,
        gsm,
        sheet_width,
        sheet_height,
        num_sheets || null,
        print_type,
        color_type,
        quantity,
        effectiveWastage,
        JSON.stringify(finishing_ids || []),
        costs.paperCost,
        costs.printCost,
        costs.wastageCost,
        costs.finishingCost,
        costs.profit,
        costs.gst,
        costs.finalPrice,
        "draft",
        req.user.id,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM jobs WHERE id=?", [r.insertId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function getJob(req, res, next) {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      `SELECT j.*, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email, c.address AS customer_address
       FROM jobs j
       LEFT JOIN customers c ON c.id = j.customer_id
       WHERE j.id=?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function updateJob(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return badRequest(res, result.array());

    const id = Number(req.params.id);
    const [existingRows] = await pool.query("SELECT * FROM jobs WHERE id=?", [id]);
    if (!existingRows.length) return res.status(404).json({ message: "Not found" });

    const incoming = { ...existingRows[0], ...req.body };

    const pricingRule = await getPricingByGsm(incoming.gsm);
    if (!pricingRule) {
      return res.status(400).json({ message: "No pricing rule for this GSM" });
    }

    const effectiveWastage =
      incoming.wastage_pct === undefined || incoming.wastage_pct === null
        ? Number(pricingRule.wastage_pct)
        : Number(incoming.wastage_pct);

    const finishingIds =
      typeof incoming.finishing_ids === "string"
        ? JSON.parse(incoming.finishing_ids || "[]")
        : incoming.finishing_ids;

    const { total: finishingCost } = await getFinishingRates(finishingIds);

    const costs = calcCosts({
      sheet_width: incoming.sheet_width,
      sheet_height: incoming.sheet_height,
      print_type: incoming.print_type,
      color_type: incoming.color_type,
      quantity: incoming.quantity,
      wastage_pct: effectiveWastage,
      profit_pct: Number(pricingRule.profit_pct),
      pricingRule,
      finishingCost,
      gst_applied: Boolean(req.body.gst_applied),
    });

    await pool.query(
      `UPDATE jobs SET
        customer_id=?,
        gsm=?,
        sheet_width=?,
        sheet_height=?,
        num_sheets=?,
        print_type=?,
        color_type=?,
        quantity=?,
        wastage_pct=?,
        finishing_ids=?,
        paper_cost=?,
        print_cost=?,
        wastage_cost=?,
        finishing_cost=?,
        profit=?,
        gst=?,
        final_price=?,
        status=?
       WHERE id=?`,
      [
        incoming.customer_id,
        incoming.gsm,
        incoming.sheet_width,
        incoming.sheet_height,
        incoming.num_sheets || null,
        incoming.print_type,
        incoming.color_type,
        incoming.quantity,
        effectiveWastage,
        JSON.stringify(finishingIds || []),
        costs.paperCost,
        costs.printCost,
        costs.wastageCost,
        costs.finishingCost,
        costs.profit,
        costs.gst,
        costs.finalPrice,
        incoming.status || existingRows[0].status,
        id,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM jobs WHERE id=?", [id]);
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function deleteJob(req, res, next) {
  try {
    const id = Number(req.params.id);
    await pool.query("DELETE FROM jobs WHERE id=?", [id]);
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

async function downloadJobPDF(req, res, next) {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      `SELECT j.*, c.id AS customer_id, c.name, c.phone, c.email, c.address
       FROM jobs j
       LEFT JOIN customers c ON c.id = j.customer_id
       WHERE j.id=?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });

    const row = rows[0];
    const finishingIds = row.finishing_ids ? JSON.parse(row.finishing_ids) : [];
    const { names } = await getFinishingRates(finishingIds);

    const doc = generateQuotationPDF({
      companyName: process.env.COMPANY_NAME || "Printing Press",
      job: row,
      customer: {
        name: row.name,
        phone: row.phone,
        email: row.email,
        address: row.address,
      },
      finishingNames: names,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="quotation-job-${id}.pdf"`
    );
    doc.pipe(res);
    doc.end();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
  downloadJobPDF,
};

