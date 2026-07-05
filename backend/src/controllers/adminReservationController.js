const asyncHandler = require("../utils/asyncHandler");
const adminReservationService = require("../services/admin.reservation.service");

// ─── GET /api/admin/reservations ──────────────────────────────────────────────
/**
 * @route   GET /api/admin/reservations
 * @desc    View all reservations (paginated, sorted, searched, filtered)
 * @access  Private — admin only
 */
const getAllReservations = asyncHandler(async (req, res) => {
  const { page, limit, sort, status, search } = req.query;

  const result = await adminReservationService.getAllReservations({
    page,
    limit,
    sort,
    status,
    search
  });

  res.status(200).json({
    success: true,
    count: result.reservations.length,
    total: result.total,
    data: result.reservations
  });
});

// ─── GET /api/admin/reservations/date/:date ───────────────────────────────────
/**
 * @route   GET /api/admin/reservations/date/:date
 * @desc    Get all reservations for a specific date
 * @access  Private — admin only
 */
const getReservationsByDate = asyncHandler(async (req, res) => {
  const reservations = await adminReservationService.getReservationsByDate(req.params.date);

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations
  });
});

// ─── GET /api/admin/reservations/stats ────────────────────────────────────────
/**
 * @route   GET /api/admin/reservations/stats
 * @desc    Get reservation statistics
 * @access  Private — admin only
 */
const getReservationStats = asyncHandler(async (req, res) => {
  const stats = await adminReservationService.getReservationStats();

  res.status(200).json(stats);
});

// ─── GET /api/admin/reservations/:id ──────────────────────────────────────────
/**
 * @route   GET /api/admin/reservations/:id
 * @desc    Get a single reservation by ID
 * @access  Private — admin only
 */
const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await adminReservationService.getReservationById(req.params.id);

  res.status(200).json({
    success: true,
    data: reservation
  });
});

// ─── PUT /api/admin/reservations/:id ──────────────────────────────────────────
/**
 * @route   PUT /api/admin/reservations/:id
 * @desc    Admin update a reservation (date, slot, guests)
 * @access  Private — admin only
 */
const updateReservation = asyncHandler(async (req, res) => {
  const { reservationDate, timeSlot, guests } = req.body;

  const reservation = await adminReservationService.updateReservationAdmin(
    req.params.id,
    { reservationDate, timeSlot, guests }
  );

  res.status(200).json({
    success: true,
    message: "Reservation updated successfully",
    data: reservation
  });
});

// ─── DELETE /api/admin/reservations/:id ───────────────────────────────────────
/**
 * @route   DELETE /api/admin/reservations/:id
 * @desc    Cancel a reservation (soft cancel)
 * @access  Private — admin only
 */
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await adminReservationService.cancelReservation(req.params.id);

  res.status(200).json({
    success: true,
    message: "Reservation cancelled successfully",
    data: reservation
  });
});

module.exports = {
  getAllReservations,
  getReservationsByDate,
  getReservationStats,
  getReservationById,
  updateReservation,
  cancelReservation
};
