const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env. Please add your MongoDB connection string.');
    process.exit(1);
}

const startServer = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected');

        // Routes
        const authRoutes = require('./routes/authRoutes');
        const expenseRoutes = require('./routes/expenseRoutes');
        const budgetRoutes = require('./routes/budgetRoutes');
        const analyticsRoutes = require('./routes/analyticsRoutes');

        app.use('/api/auth', authRoutes);
        app.use('/api/expenses', expenseRoutes);
        app.use('/api/budget', budgetRoutes);
        app.use('/api/analytics', analyticsRoutes);

        const path = require('path');

        app.use(express.static(path.join(__dirname, '../client/dist')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.error('Make sure your MongoDB server is running and the URI is correct.');
        process.exit(1);
    }
};

startServer();
