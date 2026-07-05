const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema
 *
 * Represents all actors in the system: customers and admins.
 * Password hashing is handled transparently via a pre-save hook,
 * so callers never need to hash manually.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // Never return password in query results by default
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["customer", "admin"],
        message: "Role must be either 'customer' or 'admin'",
      },
      default: "customer",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Pre-Save Hook: Hash password before saving ───────────────────────────────
/**
 * Runs before every .save() call.
 * Only re-hashes if the password field was actually modified.
 * This prevents double-hashing on non-password updates (e.g., name change).
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = 12; // Cost factor — higher = slower hash = harder to brute-force
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// ─── Instance Method: Compare plain-text password against stored hash ─────────
/**
 * @param {string} candidatePassword - Plain-text password from login request
 * @returns {Promise<boolean>}       - True if passwords match
 *
 * @example
 *   const isMatch = await user.comparePassword(req.body.password);
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Transform: Exclude sensitive fields from JSON serialization ──────────────
/**
 * When res.json() serializes a User document, this removes __v and
 * ensures password is never accidentally included (defense-in-depth).
 */
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
