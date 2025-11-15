import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import path from "path";

const mongoURI = process.env.MONGO_URI;

// Kết nối storage GridFS
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    const filename = `${Date.now()}-${file.originalname}`;
    return {
      filename: filename,
      bucketName: "uploads", // sẽ tạo bucket uploads.files / uploads.chunks
    };
  },
});

export const upload = multer({ storage });

// ✅ Helper tạo checksum MD5
export const generateChecksum = (buffer) =>
  crypto.createHash("md5").update(buffer).digest("hex");
