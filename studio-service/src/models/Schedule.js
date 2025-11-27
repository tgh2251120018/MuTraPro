const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ScheduleSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  issued_by: { type: String, required: true }, // user id from header
  room_id: { type: String, required: false },
  date: { type: Date, required: true },
  duration_minutes: { type: Number, default: 60 },
  status: { type: String, enum: ['CONFIRMED','CANCELLED','PENDING'], default: 'CONFIRMED' },
  created_at: { type: Date, default: Date.now },
  metadata: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Schedule', ScheduleSchema);

