const RecordingRoom = require('../models/RecordingRoom');
const Schedule = require('../models/Schedule');

// List all rooms with their booked dates
exports.listRooms = async (req,res) => {
  const rooms = await RecordingRoom.find().lean();
  return res.json(rooms);
};

// Check room availability for a specific date (ISO date string)
exports.checkAvailability = async (req,res) => {
  const roomNumber = parseInt(req.params.roomNumber,10);
  const date = new Date(req.query.date);
  if (isNaN(date)) return res.status(400).json({ error: 'date query missing or invalid (ISO)' });

  const room = await RecordingRoom.findOne({ room_number: roomNumber });
  if (!room) return res.status(404).json({ error: 'Room not found' });

  // Very simple check: if any occupied_on has same ISO date (same day)
  const occupied = room.occupied_on.some(d => {
    const od = new Date(d);
    return od.toISOString() === date.toISOString();
  });
  return res.json({ room_number: room.room_number, available: !occupied, date: date.toISOString() });
};

// Create booking schedule
exports.createSchedule = async (req,res) => {
  try {
    const issued_by = req.headers['x-user-id'] || req.body.issued_by;
    if (!issued_by) return res.status(400).json({ error: 'issued_by missing in header or body' });

    const { room_number, date, duration_minutes = 60, metadata } = req.body;
    if (!room_number || !date) return res.status(400).json({ error: 'room_number and date required' });

    const room = await RecordingRoom.findOne({ room_number });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const dt = new Date(date);
    // check availability (simple exact time match)
    const conflict = room.occupied_on.some(d => new Date(d).toISOString() === dt.toISOString());
    if (conflict) return res.status(409).json({ error: 'Room not available at requested date/time' });

    // create schedule
    const schedule = new (require('../models/Schedule'))({
      issued_by,
      room_id: room._id,
      date: dt,
      duration_minutes,
      metadata
    });
    await schedule.save();

    // mark room occupied_on
    room.occupied_on.push(dt);
    await room.save();

    // TODO: call Notification Service to send confirmation

    return res.status(201).json(schedule);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getSchedulesForUser = async (req,res) => {
  const userId = req.params.userId || req.headers['x-user-id'];
  if (!userId) return res.status(400).json({ error: 'user id missing' });
  const list = await require('../models/Schedule').find({ issued_by: userId }).sort('-date');
  return res.json(list);
};

