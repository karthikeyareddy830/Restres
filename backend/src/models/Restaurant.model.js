const mongoose = require("mongoose");

/**
 * Restaurant Schema
 *
 * Represents a restaurant registered in the system.
 * Each restaurant owns Tables and receives Reservations.
 */
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
      maxlength: [150, "Name cannot exceed 150 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    address: {
      street: { type: String, required: [true, "Street address is required"], trim: true },
      city:   { type: String, required: [true, "City is required"], trim: true },
      state:  { type: String, required: [true, "State is required"], trim: true },
      zip:    { type: String, required: [true, "ZIP code is required"], trim: true },
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[+\d\s\-().]{7,20}$/, "Please provide a valid phone number"],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },

    cuisine: {
      type: [String],
      default: [],
    },

    openingHours: {
      // Format: "HH:MM" in 24h, e.g. "09:00"
      open:  { type: String, default: "09:00" },
      close: { type: String, default: "22:00" },
    },

    // Maximum simultaneous reservations the restaurant can handle
    capacity: {
      type: Number,
      required: [true, "Total capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Reference to the admin user who manages this restaurant
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    // Add virtual fields to JSON output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: tables linked to this restaurant ────────────────────────────────
restaurantSchema.virtual("tables", {
  ref: "Table",
  localField: "_id",
  foreignField: "restaurant",
});

// ─── Index for fast lookup by active status ───────────────────────────────────
restaurantSchema.index({ isActive: 1 });
restaurantSchema.index({ "address.city": 1 });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
