import express from "express";
import Feedback from "../models/Feedback.js";
const router = express.Router();

router.get("/", async (req, res) => res.json(await Feedback.find()));
router.post("/", async (req, res) => {
  const feedback = new Feedback(req.body);
  await feedback.save();
  res.status(201).json(feedback);
});

export default router;
