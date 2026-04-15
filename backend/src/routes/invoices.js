const router = require("express").Router();
const { param } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const {
  generateInvoice,
  listInvoices,
  downloadInvoicePDF,
} = require("../controllers/invoiceController");

router.use(auth);

router.post("/generate/:jobId", [param("jobId").isInt()], generateInvoice);
router.get("/", listInvoices);
router.get("/:id/pdf", [param("id").isInt()], downloadInvoicePDF);

module.exports = router;

