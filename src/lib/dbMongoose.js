// src/lib/mongodb.js
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env file");
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || "defaultDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw new Error("Failed to connect to database");
  }
}