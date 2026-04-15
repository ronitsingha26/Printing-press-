const pool = require("../config/db");

async function dailyReport(req, res, next) {
  try {
    const days = Number(req.query.days || 30);
    const [rows] = await pool.query(
      `SELECT DATE(created_at) AS day, SUM(final_price) AS revenue
       FROM jobs
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY day ASC`,
      [days]
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

async function profitReport(req, res, next) {
  try {
    const days = Number(req.query.days || 30);
    const [rows] = await pool.query(
      `SELECT DATE(created_at) AS day, SUM(profit) AS profit
       FROM jobs
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY day ASC`,
      [days]
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

async function jobsSummary(_req, res, next) {
  try {
    const [statusRows] = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM jobs
       GROUP BY status`
    );
    const [typeRows] = await pool.query(
      `SELECT color_type, COUNT(*) AS count
       FROM jobs
       GROUP BY color_type`
    );
    return res.json({ byStatus: statusRows, byColorType: typeRows });
  } catch (err) {
    return next(err);
  }
}

module.exports = { dailyReport, profitReport, jobsSummary };

