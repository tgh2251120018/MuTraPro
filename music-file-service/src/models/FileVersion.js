import mongoose from "mongoose";

const fileVersionSchema = new mongoose.Schema({
  parent_file_id: { type: String, required: true },
  version_number: { type: Number, required: true },
  uploader: { type: String, required: true },
  size_in_mb: { type: Number },
  checksum: { type: String },
  gridfs_id: { type: mongoose.Schema.Types.ObjectId, ref: "fs.files" },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("FileVersion", fileVersionSchema);
