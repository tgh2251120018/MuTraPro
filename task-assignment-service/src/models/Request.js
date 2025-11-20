import mongoose from "mongoose";


const requestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  issued_by: String, // tên/email khách hàng
  status: { type: String, enum: ["Pending", "Assigned", "In Progress", "Completed"], default: "Pending" },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  attachments: [String], // đường dẫn file upload
}, { timestamps: true });

export default mongoose.model("Request", requestSchema);
