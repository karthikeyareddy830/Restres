const ApiError = require("../utils/ApiError");

/**
 * authorize — Role-Based Access Control Middleware Factory
 *
 * Returns a middleware that checks whether the authenticated user's role
 * is included in the list of permitted roles.
 *
 * MUST be used AFTER authenticate, since it relies on req.user being set.
 *
 * @param {...string} roles - One or more permitted roles (e.g., "admin", "customer")
 * @returns {Function}      - Express middleware function
 *
 * @example
 *   // Only admins:
 *   router.delete("/users/:id", authenticate, authorize("admin"), deleteUser);
 *
 *   // Admins or customers:
 *   router.get("/reservations", authenticate, authorize("admin", "customer"), getReservations);
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    // req.user is guaranteed to exist if authenticate ran first
    if (!req.user) {
      return next(
        new ApiError(401, "Authentication required before authorization.")
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. This route requires one of the following roles: [${roles.join(", ")}]. Your role: '${req.user.role}'.`
        )
      );
    }

    next();
  };
};

module.exports = authorize;
