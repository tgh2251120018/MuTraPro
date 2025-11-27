import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.config.js";
import fileRoutes from "./routes/fileRoutes.js";
import { extractUserInfo } from "./middleware/authMiddleware.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5002;


const app = express();
app.use(express.json())
app.use("/files", extractUserInfo, fileRoutes);

app.listen(PORT, () =>
  console.log(`🚀 Music File Service running on port ${PORT}`)
);
