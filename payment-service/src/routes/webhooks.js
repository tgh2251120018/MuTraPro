const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');

router.post('/:provider', ctrl.handleWebhook);

module.exports = router;

