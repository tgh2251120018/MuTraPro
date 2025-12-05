const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');

router.post('/', ctrl.createInvoice);
router.get('/:invoiceId', async (req,res) => {
  const Invoice = require('../models/Invoice');
  const inv = await Invoice.findById(req.params.invoiceId);
  if(!inv) return res.status(404).json({error:'Not found'});
  res.json(inv);
});
router.post('/:invoiceId/pay', ctrl.startPayment);

module.exports = router;

