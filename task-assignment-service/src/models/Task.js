import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
  name: { type: String, required: true },
  description: String,
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: { type: String, enum: ["Transcription Specialist", "Arrangement Specialist", "Recording Artist"] },
  status: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
  deadline: Date,
  result_files: [String], // đường dẫn file kết quả
  progress_note: String,
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
