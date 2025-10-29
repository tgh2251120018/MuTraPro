const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const DB = 'data/studios.json';
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({rooms:[], bookings:[]}, null,2));
const app = express();
app.use(bodyParser.json()); app.use(require('cors')());

function read(){ return JSON.parse(fs.readFileSync(DB)); }
function write(d){ fs.writeFileSync(DB, JSON.stringify(d, null,2)); }

app.post('/rooms', (req,res)=>{
  const db=read(); const r = {id:Date.now().toString(), name:req.body.name, capacity:req.body.capacity||1, equipment:req.body.equipment||[], created_at:new Date().toISOString()};
  db.rooms.push(r); write(db); res.json(r);
});

app.post('/bookings', (req,res)=>{
  const db = read();
  const {room_id, user_id, start_time, end_time, project_id} = req.body;
  // conflict check
  const conflict = db.bookings.find(b=>b.room_id===room_id && !(new Date(end_time) <= new Date(b.start_time) || new Date(start_time) >= new Date(b.end_time)));
  if(conflict) return res.status(409).json({error:'conflict'});
  const booking = {id:Date.now().toString(), room_id, user_id, start_time, end_time, project_id, status:'booked', created_at:new Date().toISOString()};
  db.bookings.push(booking); write(db);
  res.json(booking);
});

app.get('/rooms', (req,res)=> res.json(read().rooms));
app.get('/bookings', (req,res)=> res.json(read().bookings));

const PORT = process.env.PORT || 5100;
app.listen(PORT, ()=>console.log('studio-service on',PORT));
