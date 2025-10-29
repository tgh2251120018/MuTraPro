const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
const DB = 'data/projects.json';
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({projects:[]}, null,2));
const app = express();
app.use(cors()); app.use(bodyParser.json());
function read(){ return JSON.parse(fs.readFileSync(DB)); }
function write(d){ fs.writeFileSync(DB, JSON.stringify(d, null,2)); }

// Create new project/request
app.post('/projects', async (req,res)=>{
  const {customer_id, title, description, type, files} = req.body;
  const db = read();
  const project = {id:Date.now().toString(), customer_id, title, description, type, status:'pending', files: files||[], created_at:new Date().toISOString()};
  db.projects.push(project); write(db);
  // notify Notification Service (if available)
  try{
    await axios.post(process.env.NOTIFICATION_URL || 'http://notification-service:4001/notify', {to: customer_id, event:'project_created', payload: project});
  }catch(err){ console.warn('notify failed', err.message); }
  res.json(project);
});

// Assign project to coordinator
app.post('/projects/:id/assign', (req,res)=>{
  const db = read();
  const p = db.projects.find(x=>x.id===req.params.id);
  if(!p) return res.status(404).end();
  p.status = 'assigned'; p.assigned_to = req.body.coordinator_id; p.updated_at = new Date().toISOString();
  write(db);
  res.json(p);
});

app.get('/projects/:id', (req,res)=>{
  const db = read();
  const p = db.projects.find(x=>x.id===req.params.id);
  if(!p) return res.status(404).end();
  res.json(p);
});

app.get('/projects', (req,res)=>{
  const db = read();
  res.json(db.projects);
});

app.post('/projects/:id/status', (req,res)=>{
  const db = read();
  const p = db.projects.find(x=>x.id===req.params.id);
  if(!p) return res.status(404).end();
  p.status = req.body.status || p.status; p.updated_at=new Date().toISOString();
  write(db);
  res.json(p);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log('service-request-service on',PORT));
