import express from "express";
import FileMetadata from "../models/FileMetadata.js";
import FileVersion from "../models/FileVersion.js";
const router = express.Router();

router.get("/", async (req, res) => res.json(await FileMetadata.find()));
router.post("/", async (req, res) => {
  const file = new FileMetadata(req.body);
  await file.save();
  res.status(201).json(file);
});

router.get("/versions/:parent_id", async (req, res) => {
  const versions = await FileVersion.find({ parent_file_id: req.params.parent_id });
  res.json(versions);
});

export default router;
