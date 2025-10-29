const express = require('express');
const fs = require('fs');
const DB = 'data/feedback.json';
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({feedback:[]}, null,2));
const app = express();
app.use(require('cors')()); app.use(require('body-parser').json());

function read(){ return JSON.parse(fs.readFileSync(DB)); }
function write(d){ fs.writeFileSync(DB, JSON.stringify(d, null,2)); }

app.post('/feedback', (req,res)=>{
  const {project_id, user_id, rating, comment} = req.body;
  const db = read();
  const f = {id:Date.now().toString(), project_id, user_id, rating, comment, created_at:new Date().toISOString()};
  db.feedback.push(f); write(db);
  res.json(f);
});

app.get('/feedback', (req,res)=> res.json(read().feedback));

app.post('/revision', (req,res)=>{
  const {project_id, user_id, notes} = req.body;
  // In real system would notify Service Request to reopen revision
  res.json({ok:true, message:'revision request recorded', project_id, notes});
});

const PORT = process.env.PORT || 5300;
app.listen(PORT, ()=>console.log('feedback-service on',PORT));
