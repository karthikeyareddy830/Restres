const { body } = require("express-validator");

/**
 * Validation chains for Table endpoints.
 * Uses express-validator body() chains.
 * Results are checked by the shared validate.js middleware.
 */

// ─── Create Table Validator ───────────────────────────────────────────────────
/**
 * Rules:
 *  - tableNumber : required, must be a positive integer
 *  - capacity    : required, must be a positive integer >= 1
 */
const createTableValidator = [
  body("tableNumber")
    .notEmpty()
    .withMessage("Table number is required")
    .isInt({ min: 1 })
    .withMessage("Table number must be a positive integer"),

  body("capacity")
    .notEmpty()
    .withMessage("Capacity is required")
    .isInt({ min: 1 })
    .withMessage("Capacity must be greater than 0"),
];

// ─── Update Table Validator ───────────────────────────────────────────────────
/**
 * All fields are optional on update.
 * Rules:
 *  - tableNumber : optional, positive integer if provided
 *  - capacity    : optional, positive integer >= 1 if provided
 *  - isActive    : optional, boolean if provided
 */
const updateTableValidator = [
  body("tableNumber")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Table number must be a positive integer"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be greater than 0"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean (true or false)"),
];

module.exports = { createTableValidator, updateTableValidator };
