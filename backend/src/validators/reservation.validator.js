const { body } = require("express-validator");

/**
 * Reservation Validators
 *
 * Uses express-validator body() chains.
 * Results are checked by the shared validate.js middleware.
 *
 * Allowed time slots (must match Reservation.model.js exactly):
 *   "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"
 */

const ALLOWED_TIME_SLOTS = [
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
  "08:00 PM",
];

// ─── Create Reservation Validator ─────────────────────────────────────────────
/**
 * Rules:
 *  - reservationDate : required, valid ISO date, must not be in the past
 *  - timeSlot        : required, must be one of the 5 allowed slots
 *  - guests          : required, positive integer >= 1
 */
const createReservationValidator = [
  body("reservationDate")
    .notEmpty()
    .withMessage("Reservation date is required")
    .isISO8601()
    .withMessage("Date must be a valid date (YYYY-MM-DD)")
    .custom((value) => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const requested = new Date(value);
      requested.setUTCHours(0, 0, 0, 0);
      if (requested < today) {
        throw new Error("Reservation date cannot be in the past");
      }
      return true;
    }),

  body("timeSlot")
    .notEmpty()
    .withMessage("Time slot is required")
    .isIn(ALLOWED_TIME_SLOTS)
    .withMessage(
      `Time slot must be one of: ${ALLOWED_TIME_SLOTS.join(", ")}`
    ),

  body("guests")
    .notEmpty()
    .withMessage("Number of guests is required")
    .isInt({ min: 1 })
    .withMessage("Guests must be a positive integer (minimum 1)"),
];

// ─── Update Reservation Validator ─────────────────────────────────────────────
const updateReservationValidator = [
  body("reservationDate")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date (YYYY-MM-DD)")
    .custom((value) => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const requested = new Date(value);
      requested.setUTCHours(0, 0, 0, 0);
      if (requested < today) {
        throw new Error("Reservation date cannot be in the past");
      }
      return true;
    }),

  body("timeSlot")
    .optional()
    .isIn(ALLOWED_TIME_SLOTS)
    .withMessage(
      `Time slot must be one of: ${ALLOWED_TIME_SLOTS.join(", ")}`
    ),

  body("guests")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Guests must be a positive integer (minimum 1)"),
];


module.exports = { createReservationValidator, updateReservationValidator, ALLOWED_TIME_SLOTS };
