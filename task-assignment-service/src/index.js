const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const DB = 'data/tasks.json';
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({tasks:[]}, null,2));
const app = express();
app.use(bodyParser.json());
app.use(require('cors')());

function read(){ return JSON.parse(fs.readFileSync(DB)); }
function write(d){ fs.writeFileSync(DB, JSON.stringify(d, null,2)); }

// Create task for a project
app.post('/tasks', (req,res)=>{
  const {project_id, task_type, assigned_to, due_date} = req.body;
  const db = read();
  const t = {id:Date.now().toString(), project_id, task_type, assigned_to: assigned_to||null, status:'pending', progress:0, due_date, created_at:new Date().toISOString(), files:[]};
  db.tasks.push(t); write(db);
  res.json(t);
});

app.post('/tasks/:id/assign', (req,res)=>{
  const db = read();
  const t = db.tasks.find(x=>x.id===req.params.id);
  if(!t) return res.status(404).end();
  t.assigned_to = req.body.user_id; t.status='assigned'; t.updated_at=new Date().toISOString();
  write(db);
  res.json(t);
});

app.post('/tasks/:id/progress', (req,res)=>{
  const db = read();
  const t = db.tasks.find(x=>x.id===req.params.id);
  if(!t) return res.status(404).end();
  t.progress = req.body.progress||t.progress; t.status = req.body.status||t.status; t.updated_at=new Date().toISOString();
  write(db);
  res.json(t);
});

app.post('/tasks/:id/upload', (req,res)=>{
  // minimal: record file metadata (no actual file transfer here)
  const db = read();
  const t = db.tasks.find(x=>x.id===req.params.id);
  if(!t) return res.status(404).end();
  const file = req.body.file;
  t.files.push({...file, uploaded_at:new Date().toISOString()});
  write(db);
  res.json(t);
});

app.get('/tasks', (req,res)=> res.json(read().tasks));
app.get('/tasks/:id', (req,res)=> {
  const db = read(); const t = db.tasks.find(x=>x.id===req.params.id);
  if(!t) return res.status(404).end(); res.json(t);
});

const PORT = process.env.PORT || 5101;
app.listen(PORT, ()=>console.log('task-assignment-service on',PORT));
