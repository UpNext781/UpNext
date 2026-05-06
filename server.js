const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg'); // Added this for the database
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8080;

// Connect to Neon Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 1. Home Route
app.get('/', (req, res) => {
    res.send('UpNext Server is Online');
});

// 2. Lineup Route (The fix for your "Cannot GET" error)
app.get('/api/lineup', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM entertainers');
        res.json({ lounges: [{ id: 1, name: "The Emerald Lounge", dancers: result.rows }] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Connection Error');
    }
});

// Real-time Logic
io.on('connection', (socket) => {
    console.log('A patron or entertainer connected');
    socket.on('disconnect', () => { console.log('User disconnected'); });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
  console.log(`Server running on port ${PORT}`);

