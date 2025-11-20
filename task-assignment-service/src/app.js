import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.config.js";

import requestRoutes from "./routes/requestRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();
await connectDB(); // Connect MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
// API routes (không middleware auth để không chặn React)
// -------------------------
app.use("/requests", requestRoutes);
app.use("/tasks", taskRoutes);
app.use("/feedbacks", feedbackRoutes);

// -------------------------
// Serve React build
// -------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client/build");

// 1) Serve static files
app.use(express.static(clientBuildPath));

// 2) SPA fallback
// ❗ Không dùng app.get("*") để tránh path-to-regexp lỗi
// Log mọi request không khớp API/static
app.use((req, res) => {
  console.log(`[Fallback] ${req.method} ${req.url}`);
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res.status(500).send("Internal server error");
    }
  });
});

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Task Assignment Service running on port ${PORT}`)
);
