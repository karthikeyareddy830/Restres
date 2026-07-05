const ApiError = require("../utils/ApiError");

/**
 * Centralized Error Handling Middleware
 *
 * Must be registered LAST in Express middleware chain (after all routes).
 * Catches all errors forwarded via next(err) or thrown inside asyncHandler.
 *
 * Behavior:
 * - Development: Returns full error details including stack trace
 * - Production:  Returns safe, user-friendly messages only
 *
 * Handles special cases for:
 * - Mongoose CastError       → 400 Bad Request
 * - Mongoose ValidationError → 400 Bad Request
 * - Mongoose Duplicate Key   → 409 Conflict
 * - JWT Errors               → 401 Unauthorized
 * - Generic Errors           → 500 Internal Server Error
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // ─── Mongoose: Invalid ObjectId (e.g., malformed _id in URL param) ──────────
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid ID format: ${err.value}`);
  }

  // ─── Mongoose: Validation errors (e.g., required field missing) ─────────────
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, messages.join(", "));
  }

  // ─── Mongoose: Duplicate key violation (e.g., unique index on email) ────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(
      409,
      `Duplicate value for field '${field}'. Please use a different value.`
    );
  }

  // ─── JWT: Token is not valid ─────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please log in again.");
  }

  // ─── JWT: Token has expired ──────────────────────────────────────────────────
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Your session has expired. Please log in again.");
  }

  // ─── Build the standardized response object ──────────────────────────────────
  const isDevelopment = process.env.NODE_ENV === "development";

  const response = {
    success: false,
    message: error.message || "Internal Server Error",
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    // Stack trace exposed only in development for debugging
    ...(isDevelopment && { stack: err.stack }),
  };

  // Log full error in development for debugging visibility
  if (isDevelopment) {
    console.error("────────────────────────────────────────");
    console.error(`❌  [${req.method}] ${req.originalUrl}`);
    console.error(`   Status : ${error.statusCode}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Stack  : ${err.stack}`);
    console.error("────────────────────────────────────────");
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
