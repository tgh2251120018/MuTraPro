// src/config/db.config.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "MONGO_URI=mongodb://localhost:27017/task_assignment_db";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // các option mới tự hiểu cho mongoose v8+
      autoIndex: true,
    });
    console.log("MongoDB connected:", MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
