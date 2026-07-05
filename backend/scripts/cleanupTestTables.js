/**
 * scripts/cleanupTestTables.js
 * Permanently removes test tables (tableNumber >= 7) from the database.
 * Only used during development/testing cleanup.
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Table = require("../src/models/Table.model");
const connectDB = require("../src/config/db");

const cleanup = async () => {
  await connectDB();
  const filter = { tableNumber: { $gte: 7 } };
  const result = await Table.deleteMany(filter);
  console.log("Removed test tables (tableNumber >= 7):", result.deletedCount);
  await mongoose.connection.close();
  process.exit(0);
};

cleanup().catch((e) => { console.error(e.message); process.exit(1); });
