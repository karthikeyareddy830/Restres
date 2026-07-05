const jwt = require("jsonwebtoken");

/**
 * generateToken — Creates a signed JWT for a given user.
 *
 * Payload includes only the minimal, non-sensitive fields needed
 * for downstream middleware (authentication + authorization).
 *
 * @param {Object} user - A Mongoose User document (or plain object with _id and role)
 * @returns {string}    - Signed JWT string
 *
 * @example
 *   const token = generateToken(user);
 *   res.json({ success: true, token });
 */
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "30d";

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;
