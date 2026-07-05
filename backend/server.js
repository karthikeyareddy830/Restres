/**
 * server.js — Application Entry Point
 *
 * Responsibilities:
 * 1. Load environment variables before anything else
 * 2. Establish MongoDB connection
 * 3. Start the HTTP server
 * 4. Handle graceful shutdown on OS signals (SIGTERM, SIGINT)
 * 5. Handle unhandled promise rejections and uncaught exceptions
 *
 * This file is intentionally kept minimal.
 * Business logic belongs in src/, not here.
 */

// ─── Step 1: Load environment variables (MUST be first) ──────────────────────
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");

// ─── Step 2: Read server configuration from environment ───────────────────────
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ─── Step 3: Global Safety Nets ───────────────────────────────────────────────

/**
 * Catches unhandled promise rejections (e.g., async code without .catch())
 * In modern Node.js (v15+), this terminates the process — which is correct behavior.
 * A process manager (PM2, systemd) should restart the server after crash.
 */
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection:", reason);
  logger.error("At promise:", promise);
  // Gracefully shut down after logging
  gracefulShutdown("unhandledRejection");
});

/**
 * Catches synchronous exceptions that escaped all try-catch blocks.
 * These are almost always programming errors — crash fast and log.
 */
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err.message);
  logger.error("Stack:", err.stack);
  // Must exit — the process state is now unreliable
  process.exit(1);
});

// ─── Step 4: Server instance (declared for use in gracefulShutdown) ──────────
let server;

/**
 * gracefulShutdown — Cleanly tears down all resources before exiting.
 *
 * Order:
 * 1. Stop accepting new HTTP connections
 * 2. Allow in-flight requests to complete (up to 10 seconds)
 * 3. Close MongoDB connection
 * 4. Exit the process
 *
 * @param {string} signal - The signal or event that triggered shutdown
 */
const gracefulShutdown = (signal) => {
  logger.warn(`\n⚠️  [${signal}] Signal received. Starting graceful shutdown...`);

  // If server was never started (e.g., DB connection failed at boot), just exit
  if (!server) {
    logger.warn("Server was not running. Exiting directly.");
    process.exit(0);
  }

  server.close(async (err) => {
    if (err) {
      logger.error("Error during server close:", err.message);
      process.exit(1);
    }

    logger.info("✅  HTTP server closed. No new connections accepted.");

    // Close MongoDB connection
    try {
      const mongoose = require("mongoose");
      await mongoose.connection.close();
      logger.info("✅  MongoDB connection closed.");
    } catch (dbErr) {
      logger.error("Error closing MongoDB connection:", dbErr.message);
    }

    logger.info("👋  Graceful shutdown complete. Goodbye.");
    process.exit(0);
  });

  // Force-kill if graceful shutdown takes too long (failsafe)
  setTimeout(() => {
    logger.error("⏱️  Graceful shutdown timed out. Forcing exit.");
    process.exit(1);
  }, 10_000); // 10 seconds
};

// ─── Step 5: Boot Sequence ────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB first — don't start HTTP server without a DB
    logger.info(`🔌  Connecting to MongoDB...`);
    await connectDB();

    // Start the HTTP server
    server = app.listen(PORT, () => {
      logger.info("════════════════════════════════════════════");
      logger.info(`🚀  Server started successfully`);
      logger.info(`   Environment : ${NODE_ENV}`);
      logger.info(`   Port        : ${PORT}`);
      logger.info(`   URL         : http://localhost:${PORT}`);
      logger.info(`   Health Check: http://localhost:${PORT}/api/health`);
      logger.info("════════════════════════════════════════════");
    });

    // Handle HTTP server errors (e.g., EADDRINUSE — port already in use)
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        logger.error(`❌  Port ${PORT} is already in use. Is another server running?`);
      } else {
        logger.error("❌  HTTP server error:", err.message);
      }
      process.exit(1);
    });

  } catch (error) {
    logger.error(`❌  Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

// ─── Step 6: OS Signal Handlers for Graceful Shutdown ────────────────────────
// SIGTERM: Sent by process managers (PM2, Docker, Kubernetes) when stopping
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// SIGINT: Sent when user presses Ctrl+C in the terminal
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ─── 🚀 Start! ────────────────────────────────────────────────────────────────
startServer();
