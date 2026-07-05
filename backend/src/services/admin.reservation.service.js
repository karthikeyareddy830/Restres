const Reservation = require("../models/Reservation.model");
const Table = require("../models/Table.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");

/**
 * Normalises a date value to midnight UTC of that calendar day.
 */
const normaliseDate = (raw) => {
  const d = new Date(raw);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Get all reservations with pagination, sorting, status filter, and search.
 */
const getAllReservations = async ({ page = 1, limit = 10, sort = "reservationDate", status, search }) => {
  const query = {};

  if (status) {
    query.status = status.toUpperCase();
  }

  // If search is provided, we need to find matching user IDs first
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    }).select("_id");
    const userIds = users.map(u => u._id);
    query.user = { $in: userIds };
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const reservations = await Reservation.find(query)
    .populate({ path: "user", select: "name email" })
    .populate({ path: "table", select: "tableNumber capacity" })
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit, 10));

  const total = await Reservation.countDocuments(query);

  return { reservations, total };
};

/**
 * Get all reservations for a specific date.
 */
const getReservationsByDate = async (dateStr) => {
  const date = normaliseDate(dateStr);
  
  return await Reservation.find({ reservationDate: date })
    .populate({ path: "user", select: "name email" })
    .populate({ path: "table", select: "tableNumber capacity" })
    .sort({ timeSlot: 1 });
};

/**
 * Get a single reservation by ID.
 */
const getReservationById = async (id) => {
  const reservation = await Reservation.findById(id)
    .populate({ path: "user", select: "name email" })
    .populate({ path: "table", select: "tableNumber capacity" });

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  return reservation;
};

/**
 * Admin updates a reservation (date, slot, guests).
 * Re-runs full conflict detection.
 */
const updateReservationAdmin = async (id, updateData) => {
  const reservation = await Reservation.findById(id).populate("table");
  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (reservation.status === "CANCELLED") {
    throw new ApiError(400, "Cannot update a cancelled reservation");
  }

  // Determine what we are updating against (fallback to existing values)
  const guests = updateData.guests || reservation.guests;
  const rawDate = updateData.reservationDate || reservation.reservationDate;
  const date = normaliseDate(rawDate);
  const timeSlot = updateData.timeSlot || reservation.timeSlot;

  // If no change to date/slot/guests, just return
  if (
    date.getTime() === reservation.reservationDate.getTime() &&
    timeSlot === reservation.timeSlot &&
    guests === reservation.guests
  ) {
    return reservation;
  }

  // 1. Find all active tables with enough capacity, sorted smallest-first
  const candidates = await Table.find({
    isActive: true,
    capacity: { $gte: guests },
  }).sort({ capacity: 1 });

  if (candidates.length === 0) {
    throw new ApiError(409, "No table available with required capacity");
  }

  // 2. Find existing bookings for this date and slot
  // EXCEPT the current reservation we are updating (it can keep its own spot if valid)
  const existingBookings = await Reservation.find({
    _id: { $ne: reservation._id },
    reservationDate: date,
    timeSlot,
    status: "ACTIVE",
  }).select("table");

  const bookedTableIds = new Set(
    existingBookings.map((r) => r.table.toString())
  );

  // 3. Pick the best candidate
  // We prefer keeping the existing table if it's still a valid candidate (capacity ok and not booked by others)
  let assignedTable = null;
  
  // Check if current table is still valid and not booked
  const currentTableStillValid = candidates.some(c => c._id.toString() === reservation.table._id.toString());
  if (currentTableStillValid && !bookedTableIds.has(reservation.table._id.toString())) {
    assignedTable = reservation.table; // keep it
  } else {
    // Pick the first available from candidates
    for (const candidate of candidates) {
      if (!bookedTableIds.has(candidate._id.toString())) {
        assignedTable = candidate;
        break;
      }
    }
  }

  if (!assignedTable) {
    throw new ApiError(409, "No table available for selected date and slot");
  }

  // 4. Update and save
  reservation.table = assignedTable._id;
  reservation.reservationDate = date;
  reservation.timeSlot = timeSlot;
  reservation.guests = guests;

  await reservation.save();

  await reservation.populate([
    { path: "user", select: "name email" },
    { path: "table", select: "tableNumber capacity" },
  ]);

  return reservation;
};

/**
 * Admin cancels any reservation.
 */
const cancelReservation = async (id) => {
  const reservation = await Reservation.findById(id);
  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (reservation.status === "CANCELLED") {
    throw new ApiError(400, "This reservation is already cancelled.");
  }

  reservation.status = "CANCELLED";
  await reservation.save();

  return reservation;
};

/**
 * Get overall statistics
 */
const getReservationStats = async () => {
  const totalReservations = await Reservation.countDocuments();
  const activeReservations = await Reservation.countDocuments({ status: "ACTIVE" });
  const cancelledReservations = await Reservation.countDocuments({ status: "CANCELLED" });

  const today = normaliseDate(new Date());
  const todayReservations = await Reservation.countDocuments({ reservationDate: today });

  return {
    totalReservations,
    activeReservations,
    cancelledReservations,
    todayReservations
  };
};

module.exports = {
  getAllReservations,
  getReservationsByDate,
  getReservationById,
  updateReservationAdmin,
  cancelReservation,
  getReservationStats
};
