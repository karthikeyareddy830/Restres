const express = require("express");
const adminReservationController = require("../controllers/adminReservationController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../validators/validate");
const { updateReservationValidator } = require("../validators/reservation.validator");

const router = express.Router();

// Apply auth to all routes in this file
router.use(authenticate);
router.use(authorize("admin"));

// ─── Stats Route ──────────────────────────────────────────────────────────────
// Must be defined before /:id or /date/:date to avoid matching parameters
router.get("/stats", adminReservationController.getReservationStats);

// ─── Base Routes ──────────────────────────────────────────────────────────────
router.route("/")
  .get(adminReservationController.getAllReservations);

router.get("/date/:date", adminReservationController.getReservationsByDate);

router.route("/:id")
  .get(adminReservationController.getReservationById)
  .put(updateReservationValidator, validate, adminReservationController.updateReservation)
  .delete(adminReservationController.cancelReservation);

module.exports = router;
