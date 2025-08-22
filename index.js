require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Global variable to hold the database connection
let db;
let client;

// middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        if (!MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set');
        }
        
        // Create MongoDB client with proper options
        client = new MongoClient(MONGO_URI, {
            connectTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000,
        });
        
        // Connect to MongoDB
        await client.connect();
        
        // Test the connection
        await client.db("admin").command({ ping: 1 });
        
        // Get the database (will use the database name from connection string)
        db = client.db('educational-app-poc-dev');
        
        console.log('✅ Connected to MongoDB successfully');
        console.log('📁 Using database:', db.databaseName);
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1); 
    }
}

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: "Server is running...",
        database: db ? db.databaseName : 'Not connected',
        status: db ? 'Connected' : 'Disconnected'
    });
});

// Route to check database info
app.get('/db-info', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const collections = await db.listCollections().toArray();
        
        res.json({
            success: true,
            database: db.databaseName,
            collections: collections.map(col => col.name),
            collectionCount: collections.length
        });
    } catch (error) {
        console.error('Database info error:', error);
        res.status(500).json({ error: 'Failed to get database info' });
    }
});

// Test database operations
app.get('/test-db', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const collection = db.collection('test');
        const result = await collection.insertOne({
            message: 'Hello from MongoDB!',
            timestamp: new Date(),
            database: db.databaseName
        });

        res.json({
            success: true,
            insertedId: result.insertedId,
            message: 'Document inserted successfully',
            database: db.databaseName
        });
    } catch (error) {
        console.error('Database operation error:', error);
        res.status(500).json({ error: 'Database operation failed' });
    }
});

// Get data from database
app.get('/data', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const collection = db.collection('test');
        const documents = await collection.find({}).limit(10).toArray();

        res.json({
            success: true,
            database: db.databaseName,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        console.error('Database fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Create a new document
app.post('/data', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const collection = db.collection('test');
        const result = await collection.insertOne({
            ...req.body,
            createdAt: new Date()
        });

        res.json({
            success: true,
            insertedId: result.insertedId,
            message: 'Document created successfully'
        });
    } catch (error) {
        console.error('Create document error:', error);
        res.status(500).json({ error: 'Failed to create document' });
    }
});

// Health check route
app.get('/health', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ 
                status: 'unhealthy', 
                database: 'disconnected' 
            });
        }

        // Test database connection
        await db.admin().ping();
        
        res.json({ 
            status: 'healthy', 
            database: 'connected',
            databaseName: db.databaseName,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(503).json({ 
            status: 'unhealthy', 
            error: error.message 
        });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    try {
        if (client) {
            await client.close();
            console.log('📤 MongoDB connection closed');
        }
    } catch (error) {
        console.error('Error during shutdown:', error);
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    try {
        if (client) {
            await client.close();
            console.log('📤 MongoDB connection closed');
        }
    } catch (error) {
        console.error('Error during shutdown:', error);
    }
    process.exit(0);
});

// Start server
async function startServer() {
    try {
        await connectToMongoDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🧪 Test database: http://localhost:${PORT}/test-db`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the application
startServer();