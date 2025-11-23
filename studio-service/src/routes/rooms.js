const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');

router.get('/', ctrl.listRooms);
router.get('/:roomNumber/availability', ctrl.checkAvailability);

module.exports = router;

