// src/routes/feedbackRoutes.js
import express from "express";
import Feedback from "../models/Feedback.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await Feedback.find().lean().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("GET /feedbacks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const f = new Feedback(req.body);
    await f.save();
    res.status(201).json(f);
  } catch (err) {
    console.error("POST /feedbacks error:", err);
    res.status(400).json({ message: err.message });
  }
});

export default router;
