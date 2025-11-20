import express from "express";
import FileMetadata from "../models/FileMetadata.js";
import FileVersion from "../models/FileVersion.js";
import { upload } from "../utils/upload.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/**
 * GET /files → lấy danh sách metadata
 */
// Lấy danh sách file, filter theo requestId/taskId, trả về kèm các phiên bản
router.get("/", async (req, res) => {
  const { requestId, taskId } = req.query;
  let filter = {};
  if (requestId) filter.linked_to_request = requestId;
  if (taskId) filter.linked_to_task = taskId;
  const files = await FileMetadata.find(filter).sort({ created_at: -1 });
  // Lấy các phiên bản cho từng file
  const filesWithVersions = await Promise.all(files.map(async (file) => {
    const versions = await FileVersion.find({ parent_file_id: file.file_id }).sort({ version_number: -1 });
    return { ...file.toObject(), versions };
  }));
  res.json(filesWithVersions);
});


/**
 * POST /files/upload → upload file thật + lưu metadata
 */
import crypto from "crypto";

// Định dạng file hợp lệ
const ALLOWED_MIME = [
  "audio/mpeg", // mp3
  "audio/mp3",
  "audio/wav",
  "video/mp4",
  "application/pdf",
  // Thêm các định dạng khác nếu cần
];

// Tính checksum SHA256
function getChecksum(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = require("fs").createReadStream(filePath);
    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  // Kiểm tra định dạng file
  if (!ALLOWED_MIME.includes(req.file.mimetype)) {
    return res.status(400).json({ message: "Định dạng file không hợp lệ" });
  }

  const userId = req.user?.id || "unknown";
  const { requestId, taskId } = req.body;

  // Tính checksum
  let checksum = "";
  try {
    checksum = await getChecksum(req.file.path);
  } catch (e) {
    return res.status(500).json({ message: "Lỗi tính checksum" });
  }

  // Kiểm tra file đã tồn tại (theo tên, requestId, taskId)
  let existing = await FileMetadata.findOne({
    file_name: req.file.originalname,
    linked_to_request: requestId || null,
    linked_to_task: taskId || null
  });

  let fileMeta, versionNum = 1;
  if (existing) {
    // Tạo phiên bản mới
    versionNum = existing.version + 1;
    await FileVersion.create({
      parent_file_id: existing.file_id,
      version_number: versionNum,
      url: `/uploads/${req.file.filename}`,
      uploader: userId
    });
    // Cập nhật metadata bản mới nhất
    existing.url = `/uploads/${req.file.filename}`;
    existing.size_in_mb = (req.file.size / (1024 * 1024)).toFixed(2);
    existing.file_type = req.file.mimetype;
    existing.uploader = userId;
    existing.version = versionNum;
    existing.checksum = checksum;
    existing.linked_to_request = requestId || null;
    existing.linked_to_task = taskId || null;
    await existing.save();
    fileMeta = existing;
  } else {
    // Tạo metadata mới
    fileMeta = new FileMetadata({
      file_id: uuidv4(),
      file_name: req.file.originalname,
      file_type: req.file.mimetype,
      size_in_mb: (req.file.size / (1024 * 1024)).toFixed(2),
      uploader: userId,
      version: 1,
      url: `/uploads/${req.file.filename}`,
      checksum,
      linked_to_request: requestId || null,
      linked_to_task: taskId || null
    });
    await fileMeta.save();
  }

  res.status(201).json(fileMeta);
});


/**
 * GET /files/versions/:parent_id
 */
router.get("/versions/:parent_id", async (req, res) => {
  const versions = await FileVersion.find({
    parent_file_id: req.params.parent_id
  });
  res.json(versions);
});


import fs from "fs";
import path from "path";

// API download file an toàn
router.get("/download/:file_id", async (req, res) => {
  const userId = req.user?.id;
  const file_id = req.params.file_id;
  const version = req.query.version ? parseInt(req.query.version) : null;

  let fileMeta = await FileMetadata.findOne({ file_id });
  if (!fileMeta) return res.status(404).json({ message: "File not found" });

  // TODO: kiểm tra quyền truy cập nếu cần (ở đây chỉ kiểm tra tồn tại userId)
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  let fileUrl = fileMeta.url;
  if (version && version !== fileMeta.version) {
    // Lấy url từ FileVersion nếu cần bản cũ
    const ver = await FileVersion.findOne({ parent_file_id: file_id, version_number: version });
    if (!ver) return res.status(404).json({ message: "Version not found" });
    fileUrl = ver.url;
  }

  const filePath = path.join(process.cwd(), fileUrl.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on disk" });

  res.download(filePath, fileMeta.file_name);
});

export default router;
