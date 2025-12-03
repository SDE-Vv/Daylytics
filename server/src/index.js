require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const archiveRoutes = require('./routes/archive');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/archive', archiveRoutes);

// Simple health route
app.get('/api/health', (req, res) => res.json({ status: 'ok', now: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;
mongoose.connection.on('connected', () => {});
mongoose.connection.on('error', (err) => {});

app.listen(PORT, () => {
    const state = mongoose.connection.readyState;
    const stateText = state === 1 ? 'connected' : state === 2 ? 'connecting' : state === 0 ? 'disconnected' : 'unknown';
});
