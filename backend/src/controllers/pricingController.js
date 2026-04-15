const { validationResult } = require("express-validator");
const pool = require("../config/db");

function badRequest(res, errors) {
  return res.status(400).json({ message: "Validation error", errors });
}

async function getPricingRules(_req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, gsm, paper_rate_per_sqm, bw_rate, color_rate, wastage_pct, profit_pct, updated_at FROM pricing_rules ORDER BY gsm ASC"
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

async function updatePricingRule(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return badRequest(res, result.array());

    const id = Number(req.params.id);
    const {
      gsm,
      paper_rate_per_sqm,
      bw_rate,
      color_rate,
      wastage_pct,
      profit_pct,
    } = req.body;

    await pool.query(
      "UPDATE pricing_rules SET gsm=?, paper_rate_per_sqm=?, bw_rate=?, color_rate=?, wastage_pct=?, profit_pct=? WHERE id=?",
      [gsm, paper_rate_per_sqm, bw_rate, color_rate, wastage_pct, profit_pct, id]
    );
    const [rows] = await pool.query(
      "SELECT id, gsm, paper_rate_per_sqm, bw_rate, color_rate, wastage_pct, profit_pct, updated_at FROM pricing_rules WHERE id=?",
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function getFinishing(_req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, rate FROM finishing_options ORDER BY name ASC"
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

async function createFinishing(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return badRequest(res, result.array());
    const { name, rate } = req.body;
    const [r] = await pool.query(
      "INSERT INTO finishing_options (name, rate) VALUES (?,?)",
      [name, rate]
    );
    const [rows] = await pool.query(
      "SELECT id, name, rate FROM finishing_options WHERE id=?",
      [r.insertId]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function updateFinishing(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return badRequest(res, result.array());
    const id = Number(req.params.id);
    const { name, rate } = req.body;
    await pool.query("UPDATE finishing_options SET name=?, rate=? WHERE id=?", [
      name,
      rate,
      id,
    ]);
    const [rows] = await pool.query(
      "SELECT id, name, rate FROM finishing_options WHERE id=?",
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function deleteFinishing(req, res, next) {
  try {
    const id = Number(req.params.id);
    await pool.query("DELETE FROM finishing_options WHERE id=?", [id]);
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getPricingRules,
  updatePricingRule,
  getFinishing,
  createFinishing,
  updateFinishing,
  deleteFinishing,
};

