const express = require('express');
const axios = require('axios');
const app = express();
app.use(require('cors')());

// Simple reporting endpoints that aggregate from other services (PoC)
app.get('/summary', async (req,res)=>{
  // In real system would query DB / analytics store
  res.json({projects: 'N/A', revenue: 'N/A', specialists: 'N/A'});
});

const PORT = process.env.PORT || 5200;
app.listen(PORT, ()=>console.log('reporting-service on',PORT));
