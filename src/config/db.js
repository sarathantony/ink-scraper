const mongoose = require("mongoose");

/**
 * connectDB - Connects to MongoDB using Mongoose
 *
 * @returns {Promise<void>} Resolves when the connection is successful, otherwise exits the process with an error message.
 */
const connectDB = async () => {
  try {
    // Use the MONGO_URI environment variable to connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    // stop server if DB fails
    process.exit(1);
  }
};

module.exports = connectDB;
