import express from "express";
import { upload } from "../utils/gridfs.js";
import FileMetadata from "../models/FileMetadata.js";
import FileVersion from "../models/FileVersion.js";

const router = express.Router();

// 📥 Upload file âm thanh
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { originalname, mimetype, size, id } = req.file;
    const uploader = req.user?.id || "UNKNOWN";

    const metadata = new FileMetadata({
      file_id: `FILE-${Date.now()}`,
      uploader,
      file_name: originalname,
      file_type: mimetype,
      size_in_mb: size / (1024 * 1024),
      checksum: "pending", // có thể generate nếu cần
      gridfs_id: id,
    });

    await metadata.save();
    res.status(201).json({ message: "File uploaded", metadata });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📤 Tải file về từ GridFS
router.get("/download/:id", async (req, res) => {
  try {
    const conn = mongoose.connection;
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfs.openDownloadStream(fileId);

    downloadStream.on("error", (err) => {
      res.status(404).json({ error: "File not found" });
    });

    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
