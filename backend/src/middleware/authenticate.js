const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * authenticate — JWT Verification Middleware
 *
 * Reads the Bearer token from the Authorization header, verifies it,
 * fetches the corresponding user from the database, and attaches
 * the full user document to req.user for downstream middleware/controllers.
 *
 * Flow:
 *   Authorization: Bearer <token>
 *         ↓
 *   Verify JWT signature + expiry
 *         ↓
 *   Fetch user by decoded userId
 *         ↓
 *   Attach to req.user → call next()
 *
 * Fails with 401 if:
 *   - No token provided
 *   - Token is malformed or expired
 *   - User no longer exists in the database (e.g., deleted after token issued)
 *
 * @example
 *   router.get("/profile", authenticate, profileController.getProfile);
 */
const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  // ─── 1. Extract token from "Bearer <token>" format ───────────────────────
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(401, "Access denied. No token provided.")
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Access denied. Token is missing."));
  }

  // ─── 2. Verify token signature and expiry ────────────────────────────────
  // jwt.verify throws JsonWebTokenError or TokenExpiredError on failure,
  // which are caught by asyncHandler and normalized in errorHandler.js
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // ─── 3. Fetch user from DB (validates user still exists) ─────────────────
  const user = await User.findById(decoded.userId);

  if (!user) {
    return next(
      new ApiError(401, "The user associated with this token no longer exists.")
    );
  }

  // ─── 4. Attach user to request for downstream use ────────────────────────
  req.user = user;
  next();
});

module.exports = authenticate;
