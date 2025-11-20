import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ["Transcription Specialist", "Arrangement Specialist", "Recording Artist", "Admin"] },
  avatar: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);