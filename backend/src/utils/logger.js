/**
 * logger.js — Lightweight console logger utility
 *
 * A thin wrapper around console methods that:
 * - Adds timestamps to every log line
 * - Suppresses non-error logs in test environments
 * - Provides named log levels (info, warn, error, debug)
 *
 * In production, swap this out with a proper logger like Winston or Pino.
 */

const isTest = process.env.NODE_ENV === "test";

const timestamp = () => new Date().toISOString();

const logger = {
  info: (...args) => {
    if (!isTest) console.log(`[${timestamp()}] [INFO]`, ...args);
  },
  warn: (...args) => {
    if (!isTest) console.warn(`[${timestamp()}] [WARN]`, ...args);
  },
  error: (...args) => {
    console.error(`[${timestamp()}] [ERROR]`, ...args);
  },
  debug: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[${timestamp()}] [DEBUG]`, ...args);
    }
  },
};

module.exports = logger;
