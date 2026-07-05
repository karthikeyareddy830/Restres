const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

/**
 * Auth Controller — Thin HTTP layer.
 *
 * Responsibilities:
 * - Extract data from req
 * - Call the appropriate auth service method
 * - Send a standardized response
 *
 * No business logic lives here.
 */

// ─── POST /api/auth/register ──────────────────────────────────────────────────
/**
 * @route   POST /api/auth/register
 * @desc    Create a new user account and return a JWT
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token } = await authService.register({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user credentials and return a JWT
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    }
  });
});

module.exports = { register, login, me };
