import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes.js";
import { extractUserInfo } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(extractUserInfo); // 🔒 nhận thông tin người dùng từ Gateway

mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/music_file_management_db");

app.use("/files", fileRoutes);

app.listen(5002, () => console.log("Music File Service running on port 5002"));
