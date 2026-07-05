const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

/**
 * validate — Middleware factory that reads express-validator results.
 *
 * Place this AFTER your validator array in a route definition.
 * If any validation errors exist, it stops the request and returns 400
 * with a structured list of field-level errors.
 *
 * @returns {Function} Express middleware
 *
 * @example
 *   router.post("/register",
 *     registerValidator,   // runs the rules
 *     validate,            // checks results
 *     authController.register // only runs if valid
 *   );
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return next(new ApiError(400, "Validation failed", formatted));
  }

  next();
};

module.exports = validate;
