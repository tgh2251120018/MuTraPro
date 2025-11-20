import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.config.js";
import fileRoutes from "./routes/fileRoutes.js";
import { extractUserInfo } from "./middleware/authMiddleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// extract user info

// API backend: chỉ áp dụng middleware extractUserInfo cho /files
app.use("/files", extractUserInfo, fileRoutes);

// ---------------------------------------------------------
// REACT BUILD SERVE
// ---------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/build")));


// Route phục vụ React build: trả về index.html cho mọi route không phải API/backend (Express v5 fix)
app.all(/^(?!\/files|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// ---------------------------------------------------------

app.listen(5002, () =>
  console.log("🚀 Music File Service running on port 5002")
);
