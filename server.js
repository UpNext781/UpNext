const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Enable JSON parsing
app.use(express.json());

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('UpNext Server is Online');
});

// Real-time Stage View Logic
io.on('connection', (socket) => {
  console.log('A patron or entertainer connected:', socket.id);

  // Listen for lineup changes (Social Engineering: real-time transparency)
  socket.on('updateLineup', (data) => {
    console.log('Lineup updated:', data);
    io.emit('lineupChanged', data); // Notifies everyone instantly
  });

  // Listen for entertainer status changes
  socket.on('updateStatus', (data) => {
    console.log('Entertainer status updated:', data);
    io.emit('statusChanged', data); // Broadcast to all clients
  });

  // Listen for safety timer events
  socket.on('safetyTimerStarted', (data) => {
    console.log('Safety timer started:', data);
    io.emit('safetyEvent', { type: 'started', data });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// REST API endpoint for testing
app.post('/api/lineup/update', (req, res) => {
  const { lineupData } = req.body;
  io.emit('lineupChanged', lineupData);
  res.json({ success: true, message: 'Lineup updated via REST API' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
