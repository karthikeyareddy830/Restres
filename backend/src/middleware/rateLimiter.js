const rateLimit = require("express-rate-limit");
const ApiError = require("../utils/ApiError");

/**
 * Rate Limiter Middleware
 *
 * Prevents brute-force attacks and API abuse by limiting the number
 * of requests per IP within a configurable time window.
 *
 * Values are read from environment variables for flexibility across environments.
 */
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,                        // 100 req/window
  standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,     // Disable deprecated `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many requests from this IP. Please try again later."
      )
    );
  },
});

module.exports = rateLimiter;
