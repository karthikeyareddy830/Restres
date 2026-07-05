/**
 * ApiResponse — Standardized success response builder
 *
 * Ensures all successful API responses follow a consistent structure
 * across the entire codebase, making client-side parsing predictable.
 *
 * @example
 *   res.status(200).json(
 *     new ApiResponse(200, reservations, "Reservations fetched successfully")
 *   );
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {*}      data       - Payload to send to the client
   * @param {string} message    - Human-readable success message
   */
  constructor(statusCode, data, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
