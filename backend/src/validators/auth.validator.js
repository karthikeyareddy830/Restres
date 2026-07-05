const { body } = require("express-validator");

/**
 * Validation chains for the Register endpoint.
 *
 * Rules:
 * - name:     required, non-empty string
 * - email:    required, must be a valid email format
 * - password: required, minimum 6 characters
 */
const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

/**
 * Validation chains for the Login endpoint.
 *
 * Rules:
 * - email:    required, valid email format
 * - password: required (min length not re-checked — wrong password ≠ validation error)
 */
const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = { registerValidator, loginValidator };
