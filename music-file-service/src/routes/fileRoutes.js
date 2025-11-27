import express from "express";
import { v7 as uuidv7 } from "uuid";
import axios from 'axios';

const router = express.Router();

import { FileEntity } from '../models/FileEntity.js';
import { FileVersion } from '../models/FileVersion.js';

const toStr = (id) => id ? id.toString() : null;

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Tìm Entity
    const fileEntity = await FileEntity.findOne({ _id: id, is_deleted: false });

    if (!fileEntity) {
      return res.status(404).json({ message: "File không tồn tại." });
    }

    // 2. Tìm Version 1
    const firstVersion = await FileVersion.findOne({
      file_entity_id: id,
      version_number: 1
    }).select('-storage_path');

    if (!firstVersion) {
      return res.status(500).json({ message: "Dữ liệu bị lỗi: Không tìm thấy phiên bản gốc." });
    }

    // 3. [INSTRUCTION_B] Apply .toString() to all UUID fields manually [INSTRUCTION_E]
    const responseData = {
      // Entity Info
      file_id: toStr(fileEntity._id),          // <--- UUID -> String
      display_name: fileEntity.display_name,
      owner_id: toStr(fileEntity.owner_id),    // <--- UUID -> String
      created_at: fileEntity.created_at,
      current_total_versions: fileEntity.current_version_number,

      // Version Info
      original_version: {
        version_id: toStr(firstVersion._id),       // <--- UUID -> String
        file_entity_id: toStr(firstVersion.file_entity_id), // <--- UUID -> String
        version_number: firstVersion.version_number,
        file_type: firstVersion.file_type,
        size_in_bytes: firstVersion.size_in_bytes,
        uploader_id: toStr(firstVersion.uploader_id), // <--- UUID -> String
        created_at: firstVersion.created_at,
        status: firstVersion.status
      }
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Get File Error:", error);
    res.status(500).json({ message: "Lỗi hệ thống." });
  }
});


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



router.post("/upload/initiate", async (req, res) => {
  const { fileName, fileType } = req.body; // <-- Bỏ requestId, taskId
  const userId = req.user?.id || "anonymous";

  if (!ALLOWED_MIME.includes(fileType)) {
    return res.status(400).json({ message: "Invalid file type" });
  }

  const uniqueId = uuidv7();
  const firstVersionId = uuidv7();

  const fileExtension = path.extname(fileName);
  const category = "audio-evidence";
  const safeFileName = `${uniqueId}${fileExtension}`;

  // [PATH LOGIC CHANGE] Thay vì dùng requestId, ta dùng userId để phân loại folder
  // Path: audio-evidence/{userID}/{uuid}.mp3
  const objectPath = `${category}/${userId}/${safeFileName}`;

  try {
    // 1. Storage Service Call
    const storageResponse = await axios.post('http://localhost:3000/internal/presigned-upload', {
      filename: objectPath
    });
    const { uploadUrl } = storageResponse.data;

    // 2. Create Entity (Sạch sẽ, không liên kết task)
    const newEntity = new FileEntity({
      _id: uniqueId,
      display_name: fileName,
      owner_id: userId,
      current_version_number: 1,
      latest_version_id: firstVersionId
    });

    // 3. Create Version
    const newVersion = new FileVersion({
      _id: firstVersionId,
      file_entity_id: uniqueId,
      version_number: 1,
      status: 'PENDING',
      storage_path: objectPath,
      file_type: fileType,
      uploader_id: userId
    });

    await Promise.all([newEntity.save(), newVersion.save()]);

    res.json({
      uploadUrl,
      fileId: uniqueId,
      objectPath
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error initiating upload" });
  }
});

router.post("/upload/complete", async (req, res) => {
  const { fileId, clientChecksum, sizeInBytes } = req.body;

  try {
    const pendingVersion = await FileVersion.findOne({
      file_entity_id: fileId,
      status: 'PENDING'
    });

    if (!pendingVersion) {
      return res.status(404).json({ message: "No pending upload found." });
    }

    pendingVersion.status = 'ACTIVE';
    pendingVersion.size_in_bytes = sizeInBytes;
    pendingVersion.checksum = clientChecksum || null;
    await pendingVersion.save();

    await FileEntity.updateOne({ _id: fileId }, { updated_at: new Date() });

    res.status(200).json({
      message: "Upload completed successfully",
      file_id: fileId,
      status: 'ACTIVE'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error completing upload" });
  }
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


// API download file an toàn (Phiên bản MinIO)
router.get("/download/:file_id", async (req, res) => {
  const userId = req.user?.id;
  const _id = req.params.file_id;
  const version = req.query.version ? parseInt(req.query.version) : null;

  try {
    // 1. Tìm Metadata trong DB
    let fileMeta = await FileEntity.findOne({ _id });
    if (!fileMeta) return res.status(404).json({ message: "File not found" });

    // 2. Kiểm tra quyền (Authorization)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let file = await FileVersion.findOne({ _id: fileMeta.latest_version_id });

    // 3. Xác định đường dẫn file trên MinIO (Object Path)
    // Mặc định lấy bản hiện tại
    let objectPath = file.storage_path;


    // Nếu user đòi bản cũ (Versioning)
    if (version && version !== fileMeta.version) {
      const ver = await FileVersion.findOne({ parent_file_id: file_id, version_number: version });
      if (!ver) return res.status(404).json({ message: "Version not found" });
      objectPath = ver.url;
    }

    // 4. [INSTRUCTION_B] Call Storage Service to get the signed URL
    // We pass 'filenameOverride' so the browser sees "Báo cáo.pdf" instead of "UUIDv7.pdf"
    // [INSTRUCTION_E]
    const storageResponse = await axios.post('http://localhost:3000/internal/presigned-download', {
      objectName: objectPath,           // Ví dụ: audio/REQ-1/018e...mp3
      filenameOverride: fileMeta.file_name + "." + file.version_number // Ví dụ: Ca khúc nhạc trẻ.mp3
    });

    const { downloadUrl } = storageResponse.data;

    // 5. Điều hướng người dùng
    // Cách 1 (Khuyên dùng): Redirect trình duyệt tải ngay lập tức
    // Trình duyệt sẽ nhận 302 và tự động tải file từ MinIO về
    res.redirect(downloadUrl);

    // Cách 2 (Nếu Client là SPA/Mobile App cần lấy link):
    // res.json({ downloadUrl });

  } catch (error) {
    console.error("Download Error:", error.message);
    // Xử lý lỗi nếu Storage Service bị die hoặc lỗi mạng
    res.status(500).json({ message: "Không thể tạo đường dẫn tải file lúc này." });
  }
});

export default router;
