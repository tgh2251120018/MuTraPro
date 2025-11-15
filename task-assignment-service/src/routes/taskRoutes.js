import express from "express";
import Task from "../models/Task.js";
const router = express.Router();

router.get("/", async (req, res) => res.json(await Task.find()));
router.post("/", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

export default router;
