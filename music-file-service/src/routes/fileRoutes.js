import express from "express";
import FileMetadata from "../models/FileMetadata.js";
import FileVersion from "../models/FileVersion.js";
import { upload } from "../utils/upload.js";
import { v7 as uuidv7 } from "uuid";

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

const axios = require('axios');

router.post("/upload/initiate", async (req, res) => {
  const { fileName, fileType, requestId, taskId } = req.body;
  const userId = req.user?.id || "unknown";

  if (!ALLOWED_MIME.includes(fileType)) {
    return res.status(400).json({ message: "Định dạng file không hợp lệ" });
  }

  const uniqueId = uuidv7();

  const fileExtension = path.extname(fileName);

  const category = "audio-evidence";
  const safeFileName = `${uniqueId}${fileExtension}`;


  const objectPath = `${category}/${requestId || 'general'}/${safeFileName}`;

  try {
    const storageResponse = await axios.post('http://storage-service:3000/internal/presigned-upload', {
      filename: objectPath
    });

    const { uploadUrl } = storageResponse.data;


    const pendingFile = new FileMetadata({
      file_id: uniqueId,
      file_name: fileName,
      file_type: fileType,
      uploader: userId,
      version: 1,
      url: objectPath,
      status: 'PENDING',
      linked_to_request: requestId || null,
      linked_to_task: taskId || null
    });

    await pendingFile.save();

    res.json({
      uploadUrl,
      fileId: pendingFile.file_id,
      objectPath
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khởi tạo upload" });
  }
});

router.post("/upload/complete", async (req, res) => {
  const { fileId, clientChecksum, sizeInBytes } = req.body;
  const userId = req.user?.id || "unknown";

  try {
    const incomingFile = await FileMetadata.findOne({ file_id: fileId, status: 'PENDING' });
    if (!incomingFile) {
      return res.status(404).json({ message: "Không tìm thấy phiên upload hoặc đã hoàn thành" });
    }
    let existing = await FileMetadata.findOne({
      file_name: incomingFile.file_name,
      linked_to_request: incomingFile.linked_to_request,
      linked_to_task: incomingFile.linked_to_task,
      status: 'ACTIVE'
    });

    if (existing) {

      await FileVersion.create({
        parent_file_id: existing.file_id,
        version_number: existing.version,
        url: existing.url,
        uploader: existing.uploader,
        created_at: existing.updated_at
      });

      existing.url = incomingFile.url; // MinIO path
      existing.size_in_mb = (sizeInBytes / (1024 * 1024)).toFixed(2);
      existing.file_type = incomingFile.file_type;
      existing.uploader = userId;
      existing.version = existing.version + 1;
      existing.checksum = clientChecksum || "N/A";
      existing.updated_at = new Date();

      await existing.save();


      await FileMetadata.deleteOne({ _id: incomingFile._id });

      return res.status(200).json(existing);

    } else {
      // --- NEW FILE LOGIC ---
      incomingFile.status = 'ACTIVE'; // Activate the record
      incomingFile.size_in_mb = (sizeInBytes / (1024 * 1024)).toFixed(2);
      incomingFile.checksum = clientChecksum || "N/A";
      await incomingFile.save();

      return res.status(200).json(incomingFile);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hoàn tất upload" });
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

// API download file an toàn
const axios = require('axios'); // Đảm bảo đã cài axios

// API download file an toàn (Phiên bản MinIO)
router.get("/download/:file_id", async (req, res) => {
  const userId = req.user?.id;
  const file_id = req.params.file_id;
  const version = req.query.version ? parseInt(req.query.version) : null;

  try {
    // 1. Tìm Metadata trong DB
    let fileMeta = await FileMetadata.findOne({ file_id });
    if (!fileMeta) return res.status(404).json({ message: "File not found" });

    // 2. Kiểm tra quyền (Authorization)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // 3. Xác định đường dẫn file trên MinIO (Object Path)
    // Mặc định lấy bản hiện tại
    let objectPath = fileMeta.url;

    // Nếu user đòi bản cũ (Versioning)
    if (version && version !== fileMeta.version) {
      const ver = await FileVersion.findOne({ parent_file_id: file_id, version_number: version });
      if (!ver) return res.status(404).json({ message: "Version not found" });
      objectPath = ver.url;
    }

    // 4. [INSTRUCTION_B] Call Storage Service to get the signed URL
    // We pass 'filenameOverride' so the browser sees "Báo cáo.pdf" instead of "UUIDv7.pdf"
    // [INSTRUCTION_E]
    const storageResponse = await axios.post('http://storage-service:3000/internal/presigned-download', {
      objectName: objectPath,           // Ví dụ: audio/REQ-1/018e...mp3
      filenameOverride: fileMeta.file_name // Ví dụ: Ca khúc nhạc trẻ.mp3
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
