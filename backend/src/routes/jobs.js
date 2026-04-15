const router = require("express").Router();
const { body, param } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const {
  listJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
  downloadJobPDF,
} = require("../controllers/jobController");

router.use(auth);

router.get("/", listJobs);
router.post(
  "/",
  [
    body("customer_id").isInt(),
    body("gsm").isInt({ min: 1 }),
    body("sheet_width").isFloat({ min: 1 }),
    body("sheet_height").isFloat({ min: 1 }),
    body("print_type").isIn(["single", "double"]),
    body("color_type").isIn(["bw", "color"]),
    body("quantity").isInt({ min: 1 }),
    body("wastage_pct").optional().isFloat({ min: 0 }),
    body("finishing_ids").optional().isArray(),
    body("gst_applied").optional().isBoolean(),
  ],
  createJob
);
router.get("/:id", [param("id").isInt()], getJob);
router.put(
  "/:id",
  [
    param("id").isInt(),
    body("customer_id").optional().isInt(),
    body("gsm").optional().isInt({ min: 1 }),
    body("sheet_width").optional().isFloat({ min: 1 }),
    body("sheet_height").optional().isFloat({ min: 1 }),
    body("print_type").optional().isIn(["single", "double"]),
    body("color_type").optional().isIn(["bw", "color"]),
    body("quantity").optional().isInt({ min: 1 }),
    body("wastage_pct").optional().isFloat({ min: 0 }),
    body("finishing_ids").optional(),
    body("status").optional().isIn(["draft", "quoted", "invoiced", "paid"]),
    body("gst_applied").optional().isBoolean(),
  ],
  updateJob
);
router.delete("/:id", [param("id").isInt()], deleteJob);
router.get("/:id/pdf", [param("id").isInt()], downloadJobPDF);

module.exports = router;

