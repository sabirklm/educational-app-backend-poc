const mqttService = require('../services/mqtt');

const mqttController = {
  // POST /api/mqtt/publish
  async publishMessage(req, res) {
    try {
      const { topic, message } = req.body;

      if (!topic || !message) {
        return res.status(400).json({
          success: false,
          message: 'Topic and message are required'
        });
      }

      await mqttService.publish(topic, message);

      res.json({
        success: true,
        message: 'Message published successfully',
        data: { topic, message }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/mqtt/subscribe
  async subscribeToTopic(req, res) {
    try {
      const { topic } = req.body;

      if (!topic) {
        return res.status(400).json({
          success: false,
          message: 'Topic is required'
        });
      }

      mqttService.subscribe(topic, (receivedTopic, message) => {
        console.log(`📨 Received from ${receivedTopic}: ${message}`);
        // You can store this in database or emit to WebSocket clients
      });

      res.json({
        success: true,
        message: `Subscribed to topic: ${topic}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/mqtt/status
  getConnectionStatus(req, res) {
    res.json({
      success: true,
      data: {
        connected: mqttService.isConnected,
        timestamp: new Date().toISOString()
      }
    });
  }
};

module.exports = mqttController;