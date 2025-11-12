import mongoose from "mongoose";

const fileMetadataSchema = new mongoose.Schema({
  file_id: String,
  url: String,
  uploader: String,
  file_name: String,
  file_type: String,
  linked_to_request: String,
  linked_to_task: String,
  version: Number,
  size_in_mb: Number,
  checksum: String,
}, { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } });

export default mongoose.model("FileMetadata", fileMetadataSchema);
