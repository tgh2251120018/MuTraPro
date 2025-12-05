import mongoose from "mongoose";
import { v7 as uuidv7 } from 'uuid'
const fileVersionSchema = new mongoose.Schema(
  {
    _id: { type: 'UUID', required: true, default: () => uuidv7() },

    /**
     * LIÊN KẾT CHA (Reference)
     * Version này thuộc về File Entity nào?
     */
    file_entity_id: {
      type: 'UUID',
      ref: 'FileEntity',
      required: true,
      index: true
    },

    /**
     * SỐ THỨ TỰ VERSION
     * 1, 2, 3...
     */
    version_number: { type: Number, required: true },

    /**
     * TRẠNG THÁI UPLOAD (Cực quan trọng cho Presigned URL)
     * - PENDING: User đã xin link upload nhưng chưa báo xong.
     * - ACTIVE: Upload thành công, hợp lệ.
     * - FAILED: Upload lỗi.
     */
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'FAILED'],
      default: 'PENDING'
    },

    /**
     * MINIO PATH (Physical Path)
     * VD: audio/task-1/uuidv7.mp3
     */
    storage_path: { type: String, required: true },

    /**
     * METADATA KỸ THUẬT
     */
    file_type: { type: String, required: true }, // MIME type
    size_in_bytes: { type: Number, default: 0 }, // Lưu bytes chính xác hơn MB
    checksum: { type: String, default: null }, // MD5/SHA256 (Hex string)

    /**
     * NGƯỜI UPLOAD VERSION NÀY
     * (Có thể khác người tạo file gốc)
     */
    uploader_id: { type: 'UUID', required: true }
  },
  {
    timestamps: { createdAt: 'created_at' }
  }
);

// Composite Index: Mỗi Entity chỉ có 1 version number duy nhất
fileVersionSchema.index({ file_entity_id: 1, version_number: 1 }, { unique: true });

export const FileVersion = mongoose.model('FileVersion', fileVersionSchema);