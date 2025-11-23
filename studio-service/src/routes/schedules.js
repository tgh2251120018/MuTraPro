const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');

router.post('/', ctrl.createSchedule);
router.get('/user/:userId', ctrl.getSchedulesForUser);

module.exports = router;

