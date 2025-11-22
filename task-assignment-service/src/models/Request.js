import mongoose from "mongoose";


const requestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  progress: {
    type: String,
    enum: ["Pending", "Assigned", "In Progress", "Completed"]
  },
  issued_to_task: [String],
  attachment: [String],
}, {
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
}
);

export default mongoose.model("Request", requestSchema);
