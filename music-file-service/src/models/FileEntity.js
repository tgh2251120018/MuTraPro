import mongoose from 'mongoose';
import { v7 as uuidv7 } from 'uuid'; // Use ES Module import

const fileEntitySchema = new mongoose.Schema(
  {
    _id: { type: 'UUID', required: true, default: () => uuidv7() },

    /**
     * TÊN HIỂN THỊ (Logical Name)
     * Tên này user thấy trên UI. User có thể đổi tên này mà không ảnh hưởng file gốc.
     */
    display_name: { type: String, required: true },

    /**
     * NGƯỜI TẠO (Owner)
     */
    owner_id: { type: 'UUID', required: true },

    /**
     * CACHE CHO HIỆU NĂNG
     * Lưu ID của version mới nhất để đỡ phải query bảng con
     */
    latest_version_id: { type: 'UUID', ref: 'FileVersion' },

    /**
     * Số thứ tự version hiện tại (VD: đang ở v5)
     */
    current_version_number: { type: Number, default: 0 },

    is_deleted: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual: Để populate ngược danh sách versions nếu cần
fileEntitySchema.virtual('versions', {
  ref: 'FileVersion',
  localField: '_id',
  foreignField: 'file_entity_id',
  options: { sort: { version_number: -1 } } // Mới nhất lên đầu
});

export const FileEntity = mongoose.model('FileEntity', fileEntitySchema, "file_metadata");

