const asyncHandler = require("../utils/asyncHandler");
const tableService = require("../services/table.service");

/**
 * Table Controller — Thin HTTP layer.
 *
 * Responsibilities:
 *  - Extract data from req (body / params / query)
 *  - Call the appropriate tableService method
 *  - Send a standardised response
 *
 * No business logic lives here.
 * All routes: /api/tables
 */

// ─── POST /api/tables ─────────────────────────────────────────────────────────
/**
 * @route   POST /api/tables
 * @desc    Create a new table
 * @access  Private — admin only
 */
const createTable = asyncHandler(async (req, res) => {
  const { tableNumber, capacity } = req.body;

  const table = await tableService.createTable({ tableNumber, capacity });

  res.status(201).json({
    success: true,
    message: "Table created successfully",
    data: table,
  });
});

// ─── GET /api/tables ──────────────────────────────────────────────────────────
/**
 * @route   GET /api/tables
 * @desc    Retrieve all active tables
 * @access  Private — admin only
 */
const getTables = asyncHandler(async (req, res) => {
  const tables = await tableService.getAllTables();

  res.status(200).json({
    success: true,
    message: "Tables retrieved successfully",
    count: tables.length,
    data: tables,
  });
});

// ─── GET /api/tables/:id ──────────────────────────────────────────────────────
/**
 * @route   GET /api/tables/:id
 * @desc    Retrieve a single active table by ID
 * @access  Private — admin only
 */
const getTable = asyncHandler(async (req, res) => {
  const table = await tableService.getTableById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Table retrieved successfully",
    data: table,
  });
});

// ─── PUT /api/tables/:id ──────────────────────────────────────────────────────
/**
 * @route   PUT /api/tables/:id
 * @desc    Update a table (all fields optional)
 * @access  Private — admin only
 */
const updateTable = asyncHandler(async (req, res) => {
  const table = await tableService.updateTable(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Table updated successfully",
    data: table,
  });
});

// ─── DELETE /api/tables/:id ───────────────────────────────────────────────────
/**
 * @route   DELETE /api/tables/:id
 * @desc    Soft-delete a table (sets isActive = false)
 * @access  Private — admin only
 */
const deleteTable = asyncHandler(async (req, res) => {
  await tableService.deleteTable(req.params.id);

  res.status(200).json({
    success: true,
    message: "Table deleted successfully",
  });
});

module.exports = { createTable, getTables, getTable, updateTable, deleteTable };
