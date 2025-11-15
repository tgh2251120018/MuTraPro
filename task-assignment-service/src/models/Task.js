import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  task_id: String,
  from_request: String,
  task_name: String,
  issued_by: String,
  assigned_to: [String],
  progress: { type: String, enum: ["Not Started", "In Progress", "Completed"] },
  deadline: Date,
  result_files: [String],
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default mongoose.model("Task", taskSchema);
