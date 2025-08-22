const express = require('express');
const mqttController = require('../controllers/mqtt');
// const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All MQTT routes require authentication
// router.use(authMiddleware);

// MQTT operations
router.post('/publish', mqttController.publishMessage);
router.post('/subscribe', mqttController.subscribeToTopic);
router.get('/status', mqttController.getConnectionStatus);

module.exports = router;