const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  dailyReport,
  profitReport,
  jobsSummary,
} = require("../controllers/reportController");

router.use(auth);

router.get("/daily", dailyReport);
router.get("/profit", profitReport);
router.get("/jobs-summary", jobsSummary);

module.exports = router;

