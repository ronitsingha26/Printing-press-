const { validationResult } = require("express-validator");
const pool = require("../config/db");

function badRequest(res, errors) {
  return res.status(400).json({ message: "Validation error", errors });
}

async function listCustomers(_req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, phone, email, address FROM customers ORDER BY id DESC"
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

async function createCustomer(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return badRequest(res, result.array());

    const { name, phone, email, address } = req.body;
    const [r] = await pool.query(
      "INSERT INTO customers (name, phone, email, address) VALUES (?,?,?,?)",
      [name, phone || null, email || null, address || null]
    );
    const [rows] = await pool.query(
      "SELECT id, name, phone, email, address FROM customers WHERE id = ?",
      [r.insertId]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return badRequest(res, result.array());

    const id = Number(req.params.id);
    const { name, phone, email, address } = req.body;
    await pool.query(
      "UPDATE customers SET name=?, phone=?, email=?, address=? WHERE id=?",
      [name, phone || null, email || null, address || null, id]
    );
    const [rows] = await pool.query(
      "SELECT id, name, phone, email, address FROM customers WHERE id = ?",
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const id = Number(req.params.id);
    await pool.query("DELETE FROM customers WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

