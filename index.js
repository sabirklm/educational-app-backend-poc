require('dotenv').config();
const express = require('express');
const cors = require("cors");

const connectDB = require('./config/database');
const userRoutes = require('./src/routes/UserRoutes');
const questionRoutes = require('./src/routes/QuestionRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());


// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);

// Basic routes
app.get('/', (req, res) => {
    res.json({ message: 'API Server Running', version: '1.0.0' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});