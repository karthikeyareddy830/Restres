const Table = require("../models/Table.model");
const ApiError = require("../utils/ApiError");

/**
 * Table Service — Business logic for table management.
 *
 * This layer has zero knowledge of Express (req / res).
 * Controllers call these methods and only handle HTTP concerns.
 *
 * Soft-delete strategy:
 *   deleteTable() sets isActive = false rather than removing the document.
 *   All "fetch" queries filter by { isActive: true } so soft-deleted tables
 *   are invisible to normal operations while preserving history.
 */

// ─── Create ───────────────────────────────────────────────────────────────────
/**
 * Creates a new table.
 *
 * @param {Object} data - { tableNumber, capacity }
 * @returns {Object} Newly created Table document
 * @throws {ApiError} 409 if tableNumber already exists (active or inactive)
 */
const createTable = async ({ tableNumber, capacity }) => {
  // Check for duplicate table number across ALL records (active + inactive)
  // so a soft-deleted number cannot be silently reused
  const existing = await Table.findOne({ tableNumber });
  if (existing) {
    throw new ApiError(
      409,
      `Table number ${tableNumber} already exists. Use a different table number.`
    );
  }

  const table = await Table.create({ tableNumber, capacity });
  return table;
};

// ─── Get All (active only) ────────────────────────────────────────────────────
/**
 * Returns all active tables, sorted by tableNumber ascending.
 *
 * @returns {Array} Array of active Table documents
 */
const getAllTables = async () => {
  const tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 });
  return tables;
};

// ─── Get One ──────────────────────────────────────────────────────────────────
/**
 * Returns a single active table by its MongoDB _id.
 *
 * @param {string} tableId - MongoDB ObjectId string
 * @returns {Object} Table document
 * @throws {ApiError} 404 if not found or soft-deleted
 */
const getTableById = async (tableId) => {
  const table = await Table.findOne({ _id: tableId, isActive: true });
  if (!table) {
    throw new ApiError(404, "Table not found.");
  }
  return table;
};

// ─── Update ───────────────────────────────────────────────────────────────────
/**
 * Updates an active table's fields.
 * All update fields are optional — only provided fields are changed.
 *
 * @param {string} tableId  - MongoDB ObjectId string
 * @param {Object} data     - Partial { tableNumber?, capacity?, isActive? }
 * @returns {Object} Updated Table document
 * @throws {ApiError} 404 if not found or soft-deleted
 * @throws {ApiError} 409 if new tableNumber conflicts with an existing record
 */
const updateTable = async (tableId, data) => {
  // If caller is changing tableNumber, guard against duplicates
  if (data.tableNumber !== undefined) {
    const conflict = await Table.findOne({
      tableNumber: data.tableNumber,
      _id: { $ne: tableId }, // allow same table to keep its own number
    });
    if (conflict) {
      throw new ApiError(
        409,
        `Table number ${data.tableNumber} is already taken.`
      );
    }
  }

  const table = await Table.findOneAndUpdate(
    { _id: tableId, isActive: true },
    data,
    { new: true, runValidators: true }
  );

  if (!table) {
    throw new ApiError(404, "Table not found.");
  }
  return table;
};

// ─── Soft Delete ──────────────────────────────────────────────────────────────
/**
 * Soft-deletes a table by setting isActive = false.
 * The record remains in the database to preserve reservation history.
 *
 * @param {string} tableId - MongoDB ObjectId string
 * @returns {Object} The soft-deleted Table document
 * @throws {ApiError} 404 if not found or already soft-deleted
 */
const deleteTable = async (tableId) => {
  const table = await Table.findOneAndUpdate(
    { _id: tableId, isActive: true },
    { isActive: false },
    { new: true }
  );

  if (!table) {
    throw new ApiError(404, "Table not found.");
  }
  return table;
};

module.exports = {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
};
