/**
 * scripts/seedTables.js — Table Seeder Script
 *
 * Seeds 6 default tables into the database.
 * Idempotent: skips individual tables that already exist (by tableNumber).
 * Safe to run multiple times.
 *
 * Usage:
 *   node scripts/seedTables.js
 *   npm run seed:tables
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Table = require("../src/models/Table.model");
const connectDB = require("../src/config/db");

// ─── Seed Data ────────────────────────────────────────────────────────────────
const TABLES_SEED = [
  { tableNumber: 1, capacity: 2 },
  { tableNumber: 2, capacity: 2 },
  { tableNumber: 3, capacity: 4 },
  { tableNumber: 4, capacity: 4 },
  { tableNumber: 5, capacity: 6 },
  { tableNumber: 6, capacity: 8 },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const seedTables = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log(`\nSeeding ${TABLES_SEED.length} tables...\n`);

    let created = 0;
    let skipped = 0;

    for (const tableData of TABLES_SEED) {
      // Check if this table number already exists (active or inactive)
      const existing = await Table.findOne({ tableNumber: tableData.tableNumber });

      if (existing) {
        console.log(
          `  SKIP  Table #${tableData.tableNumber} — already exists (isActive: ${existing.isActive})`
        );
        skipped++;
      } else {
        const table = await Table.create(tableData);
        console.log(
          `  OK    Table #${table.tableNumber} created — capacity: ${table.capacity}, id: ${table._id}`
        );
        created++;
      }
    }

    console.log("\n----------------------------");
    console.log(`  Created : ${created}`);
    console.log(`  Skipped : ${skipped}`);
    console.log(`  Total   : ${TABLES_SEED.length}`);
    console.log("----------------------------");
    console.log("Seeding complete.\n");

  } catch (error) {
    console.error("Seeder failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

seedTables();
