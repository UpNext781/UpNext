const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('UpNext Server is Online');
});

// Real-time Stage View Logic
io.on('connection', (socket) => {
  console.log('A patron or entertainer connected');

  // Listen for lineup changes (Social Engineering: real-time transparency)
  socket.on('updateLineup', (data) => {
    console.log('Lineup updated:', data);
    io.emit('lineupChanged', data); // Notifies everyone instantly
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
