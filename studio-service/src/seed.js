const mongoose = require('mongoose');
const config = require('./config');
const RecordingRoom = require('./models/RecordingRoom');

async function seed(){
  await mongoose.connect(config.mongoUri);
  console.log('Seeding studio DB...');
  const rooms = [
    { room_number: 1, occupied_on: [] },
    { room_number: 2, occupied_on: [] },
    { room_number: 3, occupied_on: [] }
  ];
  await RecordingRoom.deleteMany({});
  for(const r of rooms){
    const doc = new RecordingRoom(r);
    await doc.save();
    console.log('Created room', r.room_number);
  }
  await mongoose.disconnect();
}
seed().catch(e=>{ console.error(e); process.exit(1); });

