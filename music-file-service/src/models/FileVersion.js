import mongoose from "mongoose";

const fileVersionSchema = new mongoose.Schema({
  parent_file_id: String,
  version_number: Number,
  url: String,
  uploader: String,
}, { timestamps: { createdAt: "created_at" } });

export default mongoose.model("FileVersion", fileVersionSchema, "file_version");
