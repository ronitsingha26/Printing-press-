const router = require("express").Router();
const { body } = require("express-validator");
const { login, register } = require("../controllers/authController");

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").optional().isString().isLength({ max: 100 }),
    body("role").optional().isIn(["admin", "operator"]),
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().isLength({ min: 1 })],
  login
);

module.exports = router;

