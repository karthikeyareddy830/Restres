const express = require("express");
const reservationController = require("../controllers/reservationController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../validators/validate");
const { createReservationValidator } = require("../validators/reservation.validator");

const router = express.Router();

/**
 * Reservation Routes — /api/reservations
 *
 * All routes:
 *   authenticate  → verifies Bearer JWT, attaches req.user
 *   authorize("customer") → only customer-role users allowed
 *
 * Ownership enforcement (view/cancel own only) is handled inside the service layer.
 *
 * IMPORTANT: /my MUST be declared before /:id so Express matches it
 * as a literal path, not an id param.
 */

// ─── POST /api/reservations ───────────────────────────────────────────────────
/**
 * @route   POST /api/reservations
 * @desc    Create a reservation. System auto-selects the best available table.
 * @access  Private — customer only
 * @body    { reservationDate, timeSlot, guests }
 */
router.post(
  "/",
  authenticate,
  authorize("customer"),
  createReservationValidator,
  validate,
  reservationController.createReservation
);

// ─── GET /api/reservations/my ─────────────────────────────────────────────────
/**
 * @route   GET /api/reservations/my
 * @desc    Return all reservations belonging to the authenticated customer.
 * @access  Private — customer only
 *
 * NOTE: This MUST be declared before /:id or Express will treat "my" as an id.
 */
router.get(
  "/my",
  authenticate,
  authorize("customer"),
  reservationController.getMyReservations
);

// ─── DELETE /api/reservations/:id ─────────────────────────────────────────────
/**
 * @route   DELETE /api/reservations/:id
 * @desc    Cancel (soft-delete) a reservation. Customer can only cancel their own.
 * @access  Private — customer only (ownership enforced in service)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("customer"),
  reservationController.cancelReservation
);

module.exports = router;
