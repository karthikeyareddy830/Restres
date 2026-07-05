const Reservation = require("../models/Reservation.model");
const Table = require("../models/Table.model");
const ApiError = require("../utils/ApiError");

/**
 * Reservation Service — Core booking engine.
 *
 * This layer owns ALL business logic. Controllers call these functions
 * and only handle HTTP concerns (req / res).
 *
 * =======================================================================
 * AUTO TABLE ASSIGNMENT ALGORITHM (createReservation)
 * =======================================================================
 *
 * Given: reservationDate, timeSlot, guests
 *
 * Step 1 — Candidate tables
 *   Query ALL active tables where capacity >= guests.
 *   Sort ascending by capacity (smallest-suitable-first).
 *   This minimises waste: a party of 3 gets a table-4, not a table-8.
 *
 * Step 2 — Find already-booked tables for this slot
 *   Query Reservation for all ACTIVE reservations on the same
 *   (reservationDate, timeSlot). Extract their table IDs into a Set.
 *
 * Step 3 — Walk candidates
 *   Iterate the sorted candidate list. The FIRST candidate whose _id
 *   is NOT in the booked Set is the winner. Assign immediately.
 *
 * Step 4 — No table found → 409 Conflict
 *
 * This two-query approach (candidates + booked) is O(n) and avoids
 * N+1 queries that would result from checking each candidate individually.
 *
 * =======================================================================
 * DOUBLE BOOKING PREVENTION — TWO LAYERS
 * =======================================================================
 *
 * Layer 1 (service): the Set-lookup in Step 2/3 above.
 *   Fast in-memory check; rejects conflicts before hitting the DB write path.
 *
 * Layer 2 (database): compound unique index on
 *   { table, reservationDate, timeSlot } with partialFilterExpression { status: "ACTIVE" }.
 *   Even under extreme concurrency, two simultaneous requests that both pass
 *   Layer 1 will race to insert — the second will receive a Mongo duplicate-key
 *   error (code 11000) which the global errorHandler converts to 409 Conflict.
 *
 * =======================================================================
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalises a date value to midnight UTC of that calendar day.
 * This prevents timezone drift when comparing "same date".
 *
 * @param {string|Date} raw
 * @returns {Date}
 */
const normaliseDate = (raw) => {
  const d = new Date(raw);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// ─── createReservation ────────────────────────────────────────────────────────
/**
 * Auto-assigns the best available table and creates the reservation.
 *
 * @param {Object} data  - { reservationDate, timeSlot, guests }
 * @param {string} userId - MongoDB ObjectId of the requesting customer
 * @returns {Object}      Populated Reservation document
 * @throws {ApiError} 409 when no suitable table is available
 */
const createReservation = async ({ reservationDate, timeSlot, guests }, userId) => {
  const date = normaliseDate(reservationDate);

  const existingUserBooking = await Reservation.findOne({
    user: userId,
    reservationDate: date,
    timeSlot,
    status: "ACTIVE",
  });

  if (existingUserBooking) {
    throw new ApiError(409, "You already have a reservation for this date and time.");
  }

  // ── Step 1: All active tables with enough capacity, sorted smallest-first ──
  const candidates = await Table.find({
    isActive: true,
    capacity: { $gte: guests },
  }).sort({ capacity: 1 }); // ascending → smallest suitable first

  if (candidates.length === 0) {
    throw new ApiError(
      409,
      "No table available for selected date and slot"
    );
  }

  // ── Step 2: Which tables are already booked for this exact slot? ───────────
  const existingBookings = await Reservation.find({
    reservationDate: date,
    timeSlot,
    status: "ACTIVE",
  }).select("table");

  // O(1) lookup — build a Set of booked table ID strings
  const bookedTableIds = new Set(
    existingBookings.map((r) => r.table.toString())
  );

  // ── Step 3: Pick the first candidate that is NOT booked ───────────────────
  let assignedTable = null;
  for (const candidate of candidates) {
    if (!bookedTableIds.has(candidate._id.toString())) {
      assignedTable = candidate;
      break;
    }
  }

  // ── Step 4: No table available → 409 ─────────────────────────────────────
  if (!assignedTable) {
    throw new ApiError(
      409,
      "No table available for selected date and slot"
    );
  }

  // ── Create the reservation ────────────────────────────────────────────────
  const reservation = await Reservation.create({
    user: userId,
    table: assignedTable._id,
    reservationDate: date,
    timeSlot,
    guests,
    status: "ACTIVE",
  });

  // Populate for the response
  await reservation.populate([
    { path: "user",  select: "name email" },
    { path: "table", select: "tableNumber capacity" },
  ]);

  return reservation;
};

// ─── getUserReservations ──────────────────────────────────────────────────────
/**
 * Returns all reservations belonging to a specific user.
 * Newest first. Populates table.tableNumber and user.name.
 *
 * @param {string} userId
 * @returns {Array} Array of populated Reservation documents
 */
const getUserReservations = async (userId) => {
  const reservations = await Reservation.find({ user: userId })
    .populate({ path: "user",  select: "name email" })
    .populate({ path: "table", select: "tableNumber capacity" })
    .sort({ reservationDate: -1, createdAt: -1 });

  return reservations;
};

// ─── getReservationById ───────────────────────────────────────────────────────
/**
 * Fetches a single reservation by its _id.
 * Enforces ownership: a customer can only see their own reservation.
 *
 * @param {string} reservationId
 * @param {Object} requestingUser - { _id, role }
 * @returns {Object} Populated Reservation document
 * @throws {ApiError} 404 not found | 403 ownership violation
 */
const getReservationById = async (reservationId, requestingUser) => {
  const reservation = await Reservation.findById(reservationId)
    .populate({ path: "user",  select: "name email" })
    .populate({ path: "table", select: "tableNumber capacity" });

  if (!reservation) {
    throw new ApiError(404, "Reservation not found.");
  }

  // Ownership guard — customers can only access their own reservations
  if (
    requestingUser.role === "customer" &&
    reservation.user._id.toString() !== requestingUser._id.toString()
  ) {
    throw new ApiError(403, "You are not authorised to view this reservation.");
  }

  return reservation;
};

// ─── cancelReservation ────────────────────────────────────────────────────────
/**
 * Soft-cancels a reservation by setting status = "CANCELLED".
 * Enforces ownership: customers can only cancel their own reservations.
 * Prevents double-cancellation.
 *
 * @param {string} reservationId
 * @param {Object} requestingUser - { _id, role }
 * @returns {Object} Updated Reservation document
 * @throws {ApiError} 404 | 403 | 400
 */
const cancelReservation = async (reservationId, requestingUser) => {
  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found.");
  }

  // Ownership guard
  if (reservation.user.toString() !== requestingUser._id.toString()) {
    throw new ApiError(403, "You are not authorised to cancel this reservation.");
  }

  if (reservation.status === "CANCELLED") {
    throw new ApiError(400, "This reservation is already cancelled.");
  }

  reservation.status = "CANCELLED";
  await reservation.save();

  await reservation.populate([
    { path: "user",  select: "name email" },
    { path: "table", select: "tableNumber capacity" },
  ]);

  return reservation;
};

module.exports = {
  createReservation,
  getUserReservations,
  getReservationById,
  cancelReservation,
};
