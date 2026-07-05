const mongoose = require("mongoose");

/**
 * Table Schema
 *
 * Represents a physical dining table in the restaurant.
 *
 * Design decisions:
 *  - tableNumber is a Number (not String) — globally unique across the system
 *  - isActive  is used for soft-delete: set to false instead of removing records
 *  - Capacity min:1 is enforced at schema level (Mongoose) AND validator level
 *  - __v is stripped from JSON output via toJSON transform
 */
const tableSchema = new mongoose.Schema(
  {
    // ─── Core Fields ─────────────────────────────────────────────────────────
    tableNumber: {
      type: Number,
      required: [true, "Table number is required"],
      unique: true,
    },

    capacity: {
      type: Number,
      required: [true, "Table capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    // ─── Soft Delete Flag ─────────────────────────────────────────────────────
    /**
     * isActive = false means the table is "deleted" (soft-deleted).
     * Records are never permanently removed — this preserves historical
     * reservation data that may reference this table.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// tableNumber is already unique via the schema definition.
// Index on isActive for fast "active tables" queries.
tableSchema.index({ isActive: 1 });
tableSchema.index({ capacity: 1 });

// ─── JSON Serialisation Cleanup ───────────────────────────────────────────────
tableSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
