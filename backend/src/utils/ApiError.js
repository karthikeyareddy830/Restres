/**
 * Custom API Error class that extends the native Error object.
 *
 * Allows throwing structured HTTP errors anywhere in the application
 * which the centralized errorHandler middleware will intercept and format.
 *
 * @example
 *   throw new ApiError(404, "Restaurant not found");
 *   throw new ApiError(400, "Invalid reservation time");
 *   throw new ApiError(409, "Table already booked for this time slot");
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 404, 500)
   * @param {string} message    - Human-readable error message
   * @param {Array}  errors     - Optional array of validation/field-level errors
   * @param {string} stack      - Optional custom stack trace
   */
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      // Capture the stack trace, excluding the constructor call itself
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
