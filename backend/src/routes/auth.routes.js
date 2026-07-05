const express = require("express");
const authController = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/auth.validator");
const validate = require("../validators/validate");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post(
  "/register",
  registerValidator, // 1. Run validation rules
  validate,          // 2. Check results — short-circuit with 400 if invalid
  authController.register // 3. Execute controller
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate and receive a JWT
 * @access  Public
 */
router.post(
  "/login",
  loginValidator,
  validate,
  authController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", authenticate, authController.me);

module.exports = router;
