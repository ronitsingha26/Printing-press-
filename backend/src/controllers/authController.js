const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const pool = require("../config/db");

function badRequest(res, errors) {
  return res.status(400).json({ message: "Validation error", errors });
}

async function register(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return badRequest(res, result.array());

    const { name, email, password, role } = req.body;

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "operator";
    const [r] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)",
      [name || null, email, password_hash, userRole]
    );

    return res.status(201).json({ id: r.insertId, email, role: userRole });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return badRequest(res, result.array());

    const { email, password } = req.body;
    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
      [email]
    );
    if (!rows.length) return res.status(401).json({ message: "Unauthorized" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Unauthorized" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };

