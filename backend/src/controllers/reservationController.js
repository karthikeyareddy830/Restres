const asyncHandler = require("../utils/asyncHandler");
const reservationService = require("../services/reservation.service");

/**
 * Reservation Controller — Thin HTTP layer.
 *
 * Responsibilities:
 *   - Extract data from req (body / params / user)
 *   - Call the appropriate reservationService function
 *   - Return a standardised JSON response
 *
 * No business logic lives here.
 * All routes: /api/reservations
 */

// ─── POST /api/reservations ───────────────────────────────────────────────────
/**
 * @route   POST /api/reservations
 * @desc    Customer creates a reservation. System auto-assigns best table.
 * @access  Private — customer only
 *
 * Body: { reservationDate, timeSlot, guests }
 *
 * Response shape (as per spec):
 * {
 *   success: true,
 *   message: "Reservation created successfully",
 *   data: {
 *     reservationId, tableNumber, guests, timeSlot
 *   }
 * }
 */
const createReservation = asyncHandler(async (req, res) => {
  const { reservationDate, timeSlot, guests } = req.body;

  const reservation = await reservationService.createReservation(
    { reservationDate, timeSlot, guests },
    req.user._id
  );

  // Spec-exact response shape
  res.status(201).json({
    success: true,
    message: "Reservation created successfully",
    data: {
      reservationId:   reservation._id,
      tableNumber:     reservation.table.tableNumber,
      guests:          reservation.guests,
      timeSlot:        reservation.timeSlot,
      reservationDate: reservation.reservationDate,
      status:          reservation.status,
    },
  });
});

// ─── GET /api/reservations/my ─────────────────────────────────────────────────
/**
 * @route   GET /api/reservations/my
 * @desc    Returns all reservations belonging to the authenticated customer.
 * @access  Private — customer only
 */
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await reservationService.getUserReservations(req.user._id);

  res.status(200).json({
    success: true,
    message: "Your reservations retrieved successfully",
    count:   reservations.length,
    data:    reservations.map((r) => ({
      reservationId:   r._id,
      tableNumber:     r.table.tableNumber,
      guests:          r.guests,
      timeSlot:        r.timeSlot,
      reservationDate: r.reservationDate,
      status:          r.status,
      createdAt:       r.createdAt,
    })),
  });
});

// ─── DELETE /api/reservations/:id ─────────────────────────────────────────────
/**
 * @route   DELETE /api/reservations/:id
 * @desc    Customer cancels their own reservation (sets status = CANCELLED).
 *          Soft cancel — record is preserved in the database.
 * @access  Private — customer only (ownership enforced in service)
 */
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.cancelReservation(
    req.params.id,
    req.user
  );

  res.status(200).json({
    success: true,
    message: "Reservation cancelled successfully",
    data: {
      reservationId:   reservation._id,
      tableNumber:     reservation.table.tableNumber,
      status:          reservation.status,  // "CANCELLED"
      reservationDate: reservation.reservationDate,
      timeSlot:        reservation.timeSlot,
    },
  });
});

module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation,
};
