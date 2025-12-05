const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const rooms = require('./routes/rooms');
const schedules = require('./routes/schedules');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req,res)=>res.json({status:'ok'}));

app.use('/api/v1/rooms', rooms);
app.use('/api/v1/schedules', schedules);

mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Connected to mongo (studio):', config.mongoUri);
    app.listen(config.port, ()=> console.log(`Studio service listening on ${config.port}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

