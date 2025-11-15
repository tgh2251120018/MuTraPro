import mongoose from "mongoose";

const fileMetadataSchema = new mongoose.Schema({
  file_id: { type: String, required: true, unique: true },
  uploader: { type: String, required: true },
  file_name: { type: String, required: true },
  file_type: { type: String, required: true },
  linked_to_request: { type: String },
  linked_to_task: { type: String },
  version: { type: Number, default: 1 },
  size_in_mb: { type: Number },
  checksum: { type: String },
  gridfs_id: { type: mongoose.Schema.Types.ObjectId, ref: "fs.files" }, // 🔥 liên kết GridFS
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now }
});

export default mongoose.model("FileMetadata", fileMetadataSchema);
