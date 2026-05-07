import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('UpNext Server is Online and running on Vercel');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('updateLineup', (data) => {
    io.emit('lineupChanged', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// For Vercel, we export the app instead of using httpServer.listen
export default app;
