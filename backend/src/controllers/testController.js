const asyncHandler = require("../utils/asyncHandler");

/**
 * Test Controller
 *
 * Provides simple protected endpoints to verify that
 * authentication and role-based authorization are working correctly.
 *
 * These routes are useful for:
 * - Postman / API client testing
 * - CI integration tests
 * - Debugging auth middleware issues
 *
 * In production you would remove or guard these behind an env flag.
 */

/**
 * @route   GET /api/test/customer
 * @desc    Verify customer role access
 * @access  Private (customer, admin)
 */
const customerRoute = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Customer route accessed",
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

/**
 * @route   GET /api/test/admin
 * @desc    Verify admin role access
 * @access  Private (admin only)
 */
const adminRoute = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin route accessed",
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

module.exports = { customerRoute, adminRoute };
