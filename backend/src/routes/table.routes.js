const express = require("express");
const tableController = require("../controllers/tableController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../validators/validate");
const {
  createTableValidator,
  updateTableValidator,
} = require("../validators/table.validator");

const router = express.Router();

/**
 * Table Routes — /api/tables
 *
 * All routes are protected:
 *   authenticate → verifies Bearer JWT, attaches req.user
 *   authorize("admin") → allows only admin-role users
 *
 * Middleware chain per route:
 *   authenticate → authorize("admin") → [validator] → validate → controller
 */

// ─── Collection Routes ────────────────────────────────────────────────────────

/**
 * @route   POST /api/tables
 * @desc    Create a new table
 * @access  Private — admin only
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  createTableValidator,
  validate,
  tableController.createTable
);

/**
 * @route   GET /api/tables
 * @desc    Retrieve all active tables
 * @access  Private — admin only
 */
router.get(
  "/",
  authenticate,
  authorize("admin"),
  tableController.getTables
);

// ─── Document Routes ──────────────────────────────────────────────────────────

/**
 * @route   GET /api/tables/:id
 * @desc    Retrieve a single table by MongoDB _id
 * @access  Private — admin only
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  tableController.getTable
);

/**
 * @route   PUT /api/tables/:id
 * @desc    Update a table's details (all fields optional)
 * @access  Private — admin only
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateTableValidator,
  validate,
  tableController.updateTable
);

/**
 * @route   DELETE /api/tables/:id
 * @desc    Soft-delete a table (sets isActive = false)
 * @access  Private — admin only
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  tableController.deleteTable
);

module.exports = router;
