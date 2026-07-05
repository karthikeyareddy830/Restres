/**
 * scripts/seedAdmin.js — Admin Seeder Script
 *
 * Creates a default admin user in the database.
 * Runs only if no admin account already exists (idempotent — safe to run multiple times).
 *
 * Usage:
 *   npm run seed:admin
 *   node scripts/seedAdmin.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../src/models/User.model");
const connectDB = require("../src/config/db");

// ─── Default Admin Credentials ────────────────────────────────────────────────
const ADMIN_SEED = {
  name: "Super Admin",
  email: "admin@example.com",
  password: "admin123",
  role: "admin",
};

const seedAdmin = async () => {
  try {
    console.log("🔌  Connecting to MongoDB...");
    await connectDB();

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log(`ℹ️  Admin already exists: ${existingAdmin.email}`);
      console.log("   Skipping seed. No changes made.");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create the default admin — password hashed by User model pre-save hook
    const admin = await User.create(ADMIN_SEED);

    console.log("✅  Default admin created successfully:");
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   Role  : ${admin.role}`);
    console.log(`   ID    : ${admin._id}`);
    console.log("\n⚠️  IMPORTANT: Change the admin password before deploying to production!");

  } catch (error) {
    console.error("❌  Seeder failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("👋  Database connection closed.");
    process.exit(0);
  }
};

seedAdmin();
