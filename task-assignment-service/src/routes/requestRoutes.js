// src/routes/requestRoutes.js

import express from "express";
import Request from "../models/Request.js";
import Task from "../models/Task.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer config for uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const upload = multer({ dest: uploadDir });

// Lấy danh sách request (có populate task)
router.get("/", async (req, res) => {
  try {
    const docs = await Request.find().populate("tasks").lean().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error("GET /requests error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Nhận yêu cầu mới (có upload file)
router.post("/", upload.array("attachments"), async (req, res) => {
  try {
    const { title, description, issued_by } = req.body;
    const attachments = req.files ? req.files.map(f => f.path) : [];
    const r = new Request({ title, description, issued_by, attachments });
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    console.error("POST /requests error:", err);
    res.status(400).json({ message: err.message });
  }
});

// Lấy chi tiết 1 request
router.get("/:id", async (req, res) => {
  try {
    const doc = await Request.findById(req.params.id).populate("tasks").lean();
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
