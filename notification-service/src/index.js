const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const DB = 'data/notifications.json';
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({notifications:[]}, null,2));
const app = express();
app.use(bodyParser.json()); app.use(require('cors')());

function read(){ return JSON.parse(fs.readFileSync(DB)); }
function write(d){ fs.writeFileSync(DB, JSON.stringify(d, null,2)); }

// Generic notify endpoint used by other services
app.post('/notify', (req,res)=>{
  const {to, event, payload} = req.body;
  const db = read();
  const note = {id:Date.now().toString(), to, event, payload: payload||{}, created_at:new Date().toISOString()};
  db.notifications.push(note); write(db);
  console.log('Notify', note);
  res.json({ok:true});
});

app.get('/history', (req,res)=> res.json(read().notifications));

const PORT = process.env.PORT || 4001;
app.listen(PORT, ()=>console.log('notification-service on',PORT));
