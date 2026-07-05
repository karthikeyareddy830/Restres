const mongoose = require("mongoose");

/**
 * Reservation Schema
 *
 * Represents a customer's booking of a table for a specific date / time slot.
 *
 * Design decisions:
 *  - "user"  field (not "customer") — matches spec exactly
 *  - "guests" field (not "partySize") — matches spec exactly
 *  - "reservationDate" (not "date") — matches spec exactly
 *  - status enum: ACTIVE | CANCELLED — matches spec exactly
 *  - Compound unique index on (table + reservationDate + timeSlot)
 *    gives database-level double-booking prevention as a hard safety net
 *    on top of the service-level check.
 */

// ─── Allowed Time Slots ───────────────────────────────────────────────────────
const ALLOWED_TIME_SLOTS = [
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
  "08:00 PM",
];

const reservationSchema = new mongoose.Schema(
  {
    // ─── Who ────────────────────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    // ─── Which Table (auto-assigned by service) ──────────────────────────────
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: [true, "Table is required"],
    },

    // ─── When ───────────────────────────────────────────────────────────────
    reservationDate: {
      type: Date,
      required: [true, "Reservation date is required"],
    },

    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      enum: {
        values: ALLOWED_TIME_SLOTS,
        message: `Time slot must be one of: ${ALLOWED_TIME_SLOTS.join(", ")}`,
      },
    },

    // ─── Party Size ──────────────────────────────────────────────────────────
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Guests must be at least 1"],
    },

    // ─── Lifecycle ───────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "CANCELLED"],
        message: "Status must be ACTIVE or CANCELLED",
      },
      default: "ACTIVE",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
/**
 * CRITICAL: This compound unique index is the database-level safety net
 * that makes double-bookings structurally impossible.
 *
 * Even if two concurrent requests pass the service-level check simultaneously,
 * MongoDB will reject the second insert with a duplicate key error (code 11000),
 * which the error handler converts into a 409 Conflict response.
 */
reservationSchema.index(
  { table: 1, reservationDate: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "ACTIVE" }, // only blocks ACTIVE reservations
    name: "no_double_booking",
  }
);

// Fast lookup: all reservations for a user, newest first
reservationSchema.index({ user: 1, createdAt: -1 });

// Fast availability scan: all active bookings on a date+slot
reservationSchema.index({ reservationDate: 1, timeSlot: 1, status: 1 });

// ─── JSON Transform ───────────────────────────────────────────────────────────
reservationSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// ─── Static: expose allowed slots for use in validator ────────────────────────
reservationSchema.statics.ALLOWED_TIME_SLOTS = ALLOWED_TIME_SLOTS;

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
