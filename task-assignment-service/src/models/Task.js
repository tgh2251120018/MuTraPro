import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
  _id: {
    type: 'UUID',
    default: () => uuidv7(),
    required: true
  },
  from_request: { type: 'UUID' },
  task_name: { type: String, required: true },
  description: String,
  issued_by: { type: 'UUID' },
  assigned_to: [{ type: 'UUID' }],
  progress: { type: String, enum: ["Not Started", "In Progress", "Completed"] },
  deadline: Date,
  result_files: [String], // map to file object
  progress_note: String,
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
