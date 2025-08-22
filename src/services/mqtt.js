const mqtt = require('mqtt');

class MQTTService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    connect() {
        const options = {
            host: process.env.MQTT_HOST || 'localhost',
            port: process.env.MQTT_PORT || 1883,
            username: username,
            password: password,
            clientId: `api_client_${Date.now()}`,
            keepalive: 60,
            reconnectPeriod: 1000,
        };

        this.client = mqtt.connect(options);

        this.client.on('connect', () => {
            console.log('✅ MQTT Connected');
            this.isConnected = true;
        });

        this.client.on('error', (error) => {
            console.error('❌ MQTT Error:', error);
            this.isConnected = false;
        });

        this.client.on('close', () => {
            console.log('📡 MQTT Disconnected');
            this.isConnected = false;
        });

        return this.client;
    }

    publish(topic, message) {
        if (!this.isConnected) {
            throw new Error('MQTT not connected');
        }

        const payload = typeof message === 'string' ? message : JSON.stringify(message);

        return new Promise((resolve, reject) => {
            this.client.publish(topic, payload, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    subscribe(topic, callback) {
        if (!this.isConnected) {
            throw new Error('MQTT not connected');
        }

        this.client.subscribe(topic);
        this.client.on('message', (receivedTopic, message) => {
            if (receivedTopic === topic) {
                callback(receivedTopic, message.toString());
            }
        });
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.isConnected = false;
        }
    }
}

module.exports = new MQTTService();