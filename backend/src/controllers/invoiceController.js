const pool = require("../config/db");
const { generateInvoicePDF } = require("../utils/pdfGenerator");

async function generateInvoiceNumber() {
  const date = new Date();
  const y = String(date.getFullYear()).slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const prefix = `INV${y}${m}${d}`;
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS c FROM invoices WHERE invoice_number LIKE ?",
    [`${prefix}%`]
  );
  const seq = Number(rows[0]?.c || 0) + 1;
  return `${prefix}-${String(seq).padStart(3, "0")}`;
}

async function generateInvoice(req, res, next) {
  try {
    const jobId = Number(req.params.jobId);
    const [jobs] = await pool.query("SELECT * FROM jobs WHERE id=?", [jobId]);
    if (!jobs.length) return res.status(404).json({ message: "Job not found" });
    const job = jobs[0];

    const [existing] = await pool.query(
      "SELECT * FROM invoices WHERE job_id=?",
      [jobId]
    );
    if (existing.length) return res.status(400).json({ message: "Invoice already exists" });

    const invoiceNumber = await generateInvoiceNumber();
    const total = Number(job.final_price || 0);
    const gstApplied = Number(job.gst || 0) > 0;

    const [r] = await pool.query(
      "INSERT INTO invoices (job_id, invoice_number, gst_applied, total) VALUES (?,?,?,?)",
      [jobId, invoiceNumber, gstApplied, total]
    );

    await pool.query("UPDATE jobs SET status='invoiced' WHERE id=?", [jobId]);

    const [rows] = await pool.query("SELECT * FROM invoices WHERE id=?", [
      r.insertId,
    ]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function listInvoices(_req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT i.*, j.customer_id, j.final_price, j.created_at AS job_created_at, c.name AS customer_name
       FROM invoices i
       JOIN jobs j ON j.id = i.job_id
       LEFT JOIN customers c ON c.id = j.customer_id
       ORDER BY i.id DESC`
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

async function downloadInvoicePDF(req, res, next) {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      `SELECT i.*, j.*, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email, c.address AS customer_address
       FROM invoices i
       JOIN jobs j ON j.id = i.job_id
       LEFT JOIN customers c ON c.id = j.customer_id
       WHERE i.id=?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    const row = rows[0];

    const finishingIds = row.finishing_ids ? JSON.parse(row.finishing_ids) : [];
    let finishingNames = [];
    if (finishingIds.length) {
      const ids = finishingIds.map((x) => Number(x)).filter((n) => Number.isFinite(n));
      const [f] = await pool.query(
        `SELECT name FROM finishing_options WHERE id IN (${ids
          .map(() => "?")
          .join(",")})`,
        ids
      );
      finishingNames = f.map((x) => x.name);
    }

    const doc = generateInvoicePDF({
      companyName: process.env.COMPANY_NAME || "Printing Press",
      invoice: row,
      job: row,
      customer: {
        name: row.customer_name,
        phone: row.customer_phone,
        email: row.customer_email,
        address: row.customer_address,
      },
      finishingNames,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${row.invoice_number}.pdf"`
    );
    doc.pipe(res);
    doc.end();
  } catch (err) {
    return next(err);
  }
}

module.exports = { generateInvoice, listInvoices, downloadInvoicePDF };

