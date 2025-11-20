

import express from "express";
import Task from "../models/Task.js";
import Request from "../models/Request.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const upload = multer({ dest: uploadDir });

// Lấy danh sách task
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assigned_to").populate("request").lean().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo task mới (phân công nhiệm vụ cho specialist)
router.post("/", async (req, res) => {
  try {
    const { requestId, name, description, assigned_to, role, deadline } = req.body;
    const task = new Task({
      request: requestId,
      name,
      description,
      assigned_to,
      role,
      deadline
    });
    await task.save();
    // Gắn task vào request
    if (requestId) await Request.findByIdAndUpdate(requestId, { $push: { tasks: task._id } });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật tiến độ, deadline, note
router.put("/:id", async (req, res) => {
  try {
    const { status, deadline, progress_note } = req.body;
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status, deadline, progress_note },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Upload file kết quả cho task
router.post("/:id/upload", upload.array("result_files"), async (req, res) => {
  try {
    const files = req.files ? req.files.map(f => f.path) : [];
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { result_files: { $each: files } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa task
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Task.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
