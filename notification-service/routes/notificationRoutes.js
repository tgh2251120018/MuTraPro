const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');

router.get('/', controller.getHistory);
router.post('/test', controller.createTestNotification);

module.exports = router;