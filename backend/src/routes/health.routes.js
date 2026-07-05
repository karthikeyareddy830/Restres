const express = require("express");
const { healthCheck } = require("../controllers/healthController");

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Server health check endpoint
 * @access  Public
 */
router.get("/", healthCheck);

module.exports = router;
