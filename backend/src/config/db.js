const mongoose = require("mongoose");

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Uses connection pooling and retry logic for production resilience.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  const options = {
    // Mongoose 7+ uses these defaults, but explicit is better
    serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is unreachable
    socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
    maxPoolSize: 10,                // Maintain up to 10 socket connections
  };

  try {
    const conn = await mongoose.connect(mongoURI, options);

    console.log(
      `✅  MongoDB Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`
    );

    // Attach event listeners for post-connection lifecycle
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.info("🔄  MongoDB reconnected successfully.");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`❌  MongoDB connection error: ${err.message}`);
    });

    return conn;
  } catch (error) {
    console.error(`❌  MongoDB initial connection failed: ${error.message}`);
    throw error; // Re-throw so server.js can handle graceful shutdown
  }
};

module.exports = connectDB;
