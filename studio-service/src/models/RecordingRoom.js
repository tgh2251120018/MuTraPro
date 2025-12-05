const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const RecordingRoomSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  room_number: { type: Number, required: true, unique: true },
  occupied_on: { type: [Date], default: [] } // array of Date or ISO strings of booked slots
});

module.exports = mongoose.model('RecordingRoom', RecordingRoomSchema);

