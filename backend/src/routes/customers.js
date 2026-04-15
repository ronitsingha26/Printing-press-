const router = require("express").Router();
const { body, param } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const {
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

router.use(auth);

router.get("/", listCustomers);
router.post(
  "/",
  [body("name").isString().isLength({ min: 1, max: 100 })],
  createCustomer
);
router.put(
  "/:id",
  [param("id").isInt(), body("name").isString().isLength({ min: 1, max: 100 })],
  updateCustomer
);
router.delete("/:id", [param("id").isInt()], deleteCustomer);

module.exports = router;

