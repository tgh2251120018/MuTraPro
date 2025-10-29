const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const DB_FILE = 'data/users.json';
const SECRET = process.env.JWT_SECRET || 'dev_secret';

if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({users:[]}, null, 2));

const app = express();
app.use(cors());
app.use(bodyParser.json());

function readDB(){ return JSON.parse(fs.readFileSync(DB_FILE)); }
function writeDB(d){ fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2)); }

// Register
app.post('/register', (req, res) => {
  const {email, password, full_name, role} = req.body;
  if(!email || !password) return res.status(400).json({error:'email and password required'});
  const db = readDB();
  if(db.users.find(u=>u.email===email)) return res.status(400).json({error:'email exists'});
  const hash = bcrypt.hashSync(password, 8);
  const user = {id: Date.now().toString(), email, password_hash: hash, full_name, role: role||'customer', profile:{}, created_at: new Date().toISOString()};
  db.users.push(user); writeDB(db);
  const token = jwt.sign({sub:user.id, role:user.role}, SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:user.id,email:user.email,role:user.role,full_name:user.full_name}});
});

// Login
app.post('/login', (req,res)=>{
  const {email,password}=req.body;
  const db = readDB();
  const user = db.users.find(u=>u.email===email);
  if(!user) return res.status(401).json({error:'invalid'});
  const ok = bcrypt.compareSync(password, user.password_hash);
  if(!ok) return res.status(401).json({error:'invalid'});
  const token = jwt.sign({sub:user.id, role:user.role}, SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:user.id,email:user.email,role:user.role,full_name:user.full_name}});
});

// Middleware
function auth(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({error:'no token'});
  const token = header.replace('Bearer ','');
  try{
    const payload = jwt.verify(token, SECRET);
    req.user = payload; next();
  }catch(e){ return res.status(401).json({error:'invalid token'}); }
}

function authorize(roles){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).end();
    if(roles.includes(req.user.role)) return next();
    return res.status(403).json({error:'forbidden'});
  }
}

// Profile
app.get('/me', auth, (req,res)=>{
  const db = readDB();
  const user = db.users.find(u=>u.id===req.user.sub);
  if(!user) return res.status(404).end();
  res.json({id:user.id,email:user.email,role:user.role,full_name:user.full_name,profile:user.profile});
});

app.put('/me', auth, (req,res)=>{
  const db = readDB();
  const user = db.users.find(u=>u.id===req.user.sub);
  if(!user) return res.status(404).end();
  user.profile = req.body.profile || user.profile;
  user.full_name = req.body.full_name || user.full_name;
  writeDB(db);
  res.json({ok:true});
});

// Admin: list users
app.get('/users', auth, authorize(['admin']), (req,res)=>{
  const db = readDB();
  res.json(db.users.map(u=>({id:u.id,email:u.email,role:u.role,full_name:u.full_name})));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>console.log('auth-service on',PORT));
