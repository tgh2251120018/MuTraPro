import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";

import requestRoutes from "./routes/requestRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import { extractUserInfo } from "./middleware/authMiddleware.js";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(extractUserInfo); // 🔒 nhận thông tin người dùng từ Gateway
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/task_management_db");

app.use("/requests", requestRoutes);
app.use("/tasks", taskRoutes);
app.use("/feedbacks", feedbackRoutes);

app.listen(5001, () => console.log("Task Assignment Service running on port 5001"));
