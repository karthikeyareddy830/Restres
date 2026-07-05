const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");

/**
 * Auth Service — Business logic for authentication.
 *
 * Controllers call these methods and only handle HTTP concerns.
 * This layer has zero knowledge of Express (req/res).
 */

// ─── Register ─────────────────────────────────────────────────────────────────
/**
 * Creates a new user account.
 *
 * @param {Object} data - { name, email, password }
 * @returns {{ user: Object, token: string }}
 * @throws {ApiError} 409 if email already exists
 */
const register = async ({ name, email, password }) => {
  // Check for duplicate email before attempting to save
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // Create user — password hashing is handled by the pre-save hook in User.model.js
  const user = await User.create({ name, email, password });

  const token = generateToken(user);

  return { user, token };
};

// ─── Login ────────────────────────────────────────────────────────────────────
/**
 * Authenticates a user by email and password.
 *
 * @param {Object} data - { email, password }
 * @returns {{ user: Object, token: string }}
 * @throws {ApiError} 401 if credentials are invalid
 */
const login = async ({ email, password }) => {
  // Explicitly select password — it has `select: false` on the schema
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    // Generic message prevents email enumeration attacks
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken(user);

  // Remove password from the returned object (toJSON hook also handles this,
  // but explicit removal here avoids any accidental exposure before serialization)
  user.password = undefined;

  return { user, token };
};

module.exports = { register, login };
