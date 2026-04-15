const router = require("express").Router();
const { body, param } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const {
  getPricingRules,
  updatePricingRule,
  getFinishing,
  createFinishing,
  updateFinishing,
  deleteFinishing,
} = require("../controllers/pricingController");

router.use(auth);

router.get("/", getPricingRules);
router.put(
  "/:id",
  adminOnly,
  [
    param("id").isInt(),
    body("gsm").isInt({ min: 1 }),
    body("paper_rate_per_sqm").isDecimal(),
    body("bw_rate").isDecimal(),
    body("color_rate").isDecimal(),
    body("wastage_pct").isFloat({ min: 0 }),
    body("profit_pct").isFloat({ min: 0 }),
  ],
  updatePricingRule
);

router.get("/finishing", getFinishing);
router.post(
  "/finishing",
  [body("name").isString().isLength({ min: 1, max: 50 }), body("rate").isDecimal()],
  createFinishing
);
router.put(
  "/finishing/:id",
  [
    param("id").isInt(),
    body("name").isString().isLength({ min: 1, max: 50 }),
    body("rate").isDecimal(),
  ],
  updateFinishing
);
router.delete("/finishing/:id", [param("id").isInt()], deleteFinishing);

module.exports = router;

