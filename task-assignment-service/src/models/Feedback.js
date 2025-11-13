import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  feedback_id: String,
  request_title: String,
  issued_by: String,
  description: String,
  progress: String,
  issued_to_task: String,
}, { timestamps: { createdAt: "created_at" } });

export default mongoose.model("Feedback", feedbackSchema);
