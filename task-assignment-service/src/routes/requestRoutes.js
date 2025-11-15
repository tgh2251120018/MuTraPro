import express from "express";
import Request from "../models/Request.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const requests = await Request.find();
  res.json(requests);
});

router.post("/", async (req, res) => {
  const newReq = new Request(req.body);
  await newReq.save();
  res.status(201).json(newReq);
});

export default router;
