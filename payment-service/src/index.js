const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const DB = 'data/payments.json';
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({payments:[]}, null,2));
const app = express();
app.use(require('cors')());
app.use(bodyParser.json());
function read(){ return JSON.parse(fs.readFileSync(DB)); }
function write(d){ fs.writeFileSync(DB, JSON.stringify(d, null,2)); }

app.post('/create', async (req,res)=>{
  const {project_id, user_id, amount, provider} = req.body;
  const db = read();
  const p = {id: uuidv4(), project_id, user_id, amount, currency:'VND', status:'pending', provider: provider||'sandbox', created_at:new Date().toISOString()};
  db.payments.push(p); write(db);
  try{
    await axios.post(process.env.NOTIFICATION_URL || 'http://notification-service:4001/notify', {to: user_id, event:'payment_created', payload: p});
  }catch(e){ console.warn('notify failed', e.message); }
  res.json(p);
});

app.post('/webhook/succeed', (req,res)=>{
  const {payment_id} = req.body;
  const db = read();
  const p = db.payments.find(x=>x.id===payment_id);
  if(!p) return res.status(404).end();
  p.status = 'success'; p.updated_at = new Date().toISOString(); write(db);
  axios.post(process.env.NOTIFICATION_URL || 'http://notification-service:4001/notify', {to: p.user_id, event:'payment_succeeded', payload: p}).catch(()=>{});
  res.json({ok:true});
});

app.get('/payments', (req,res)=> res.json(read().payments));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('payment-service on',PORT));
