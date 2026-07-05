const asyncHandler = require("../utils/asyncHandler");

/**
 * Health Check Controller
 *
 * Returns a standardized status response for:
 * - Load balancer health probes
 * - Uptime monitoring services (e.g., UptimeRobot, AWS ALB)
 * - DevOps deployment readiness checks
 *
 * @route   GET /api/health
 * @access  Public
 */
const healthCheck = asyncHandler(async (req, res) => {
  const mongoose = require("mongoose");

  // Mongoose readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? "connected" : "disconnected";

  res.status(200).json({
    success: true,
    message: "Server running successfully",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStatus,
      name: mongoose.connection.name || "N/A",
    },
  });
});

module.exports = { healthCheck };
