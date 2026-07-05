/**
 * app.js — Express Application Configuration
 *
 * Responsible for:
 * - Assembling all middleware (security, parsing, logging)
 * - Mounting all route modules
 * - Mounting the centralized error handler (must be LAST)
 *
 * NOTE: This file does NOT start the server. That is server.js's job.
 * This separation allows app.js to be imported in tests without
 * binding to a port.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");
const ApiError = require("./utils/ApiError");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// ─── Route Imports ────────────────────────────────────────────────────────────
const healthRoutes      = require("./routes/health.routes");
const authRoutes        = require("./routes/auth.routes");
const testRoutes        = require("./routes/test.routes");
const restaurantRoutes  = require("./routes/restaurant.routes");
const tableRoutes       = require("./routes/table.routes");
const reservationRoutes = require("./routes/reservation.routes");
const adminReservationRoutes = require("./routes/admin.reservation.routes");
// Additional feature routes will be imported here

// ─── Initialize Express App ───────────────────────────────────────────────────
const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
/**
 * helmet: Sets various HTTP headers to protect against well-known web vulnerabilities.
 * Includes CSP, XSS protection, clickjacking prevention, and more.
 */
app.use(helmet());

/**
 * cors: Configures Cross-Origin Resource Sharing.
 * Only allows requests from the CLIENT_URL defined in .env.
 */
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent cross-origin
};
app.use(cors(corsOptions));

/**
 * rateLimiter: Limits repeated requests to public APIs.
 * Applied globally here; can be applied per-router for granular control.
 */
app.use("/api", rateLimiter);

// ─── Request Parsing ──────────────────────────────────────────────────────────
/**
 * express.json: Parses incoming requests with JSON payloads.
 * limit: Prevents overly large payloads (payload bomb protection).
 */
app.use(express.json({ limit: "10kb" }));

/**
 * express.urlencoded: Parses URL-encoded bodies (HTML form submissions).
 */
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/**
 * Data Sanitization against NoSQL query injection
 */
app.use(mongoSanitize());

/**
 * Data Sanitization against XSS
 */
app.use(xss());

// ─── Performance Middleware ───────────────────────────────────────────────────
/**
 * compression: Compresses all responses using gzip/deflate.
 * Significantly reduces response payload sizes.
 */
app.use(compression());

// ─── HTTP Request Logging ─────────────────────────────────────────────────────
/**
 * morgan: HTTP request logger.
 * "dev"     format in development (colorized, concise)
 * "combined" format in production (Apache-style, suitable for log aggregators)
 */
const morganFormat =
  process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

// ─── API Routes ───────────────────────────────────────────────────────────────
/**
 * All routes are prefixed with /api for versioning readiness.
 * When versioning is needed, prefix with /api/v1, /api/v2, etc.
 */
app.use("/api/health",       healthRoutes);
app.use("/api/auth",         authRoutes);
app.use("/api/test",         testRoutes);
app.use("/api/restaurants",  restaurantRoutes);
app.use("/api/tables",       tableRoutes);       // Standalone table management
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin/reservations", adminReservationRoutes);

// ─── 404 Handler (Unknown Routes) ────────────────────────────────────────────
/**
 * Catches any request that didn't match a defined route.
 * Must be placed AFTER all route mounts, BEFORE errorHandler.
 */
app.all("*", (req, res, next) => {
  next(
    new ApiError(
      404,
      `Route '${req.originalUrl}' not found on this server.`
    )
  );
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
/**
 * Must be the LAST middleware registered.
 * Express identifies it as an error handler by its 4-argument signature: (err, req, res, next)
 */
app.use(errorHandler);

module.exports = app;
