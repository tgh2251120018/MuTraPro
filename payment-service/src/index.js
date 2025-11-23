const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const invoices = require('./routes/invoices');
const webhooks = require('./routes/webhooks');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

app.get('/health', (req,res)=>res.json({status:'ok'}));

app.use('/api/v1/invoices', invoices);
app.use('/api/v1/webhooks', webhooks);

mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Connected to mongo:', config.mongoUri);
    app.listen(config.port, ()=> console.log(`Payment service listening on ${config.port}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

