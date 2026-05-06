const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8080;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/health', (req, res) => {
  res.send('UpNext Server is Online');
});

app.get('/api/lineup', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.club_id, c.name AS club_name, e.id AS entertainer_id, e.stage_name, l.sort_order
       FROM lineups l
       JOIN entertainer_profiles e ON e.id = l.entertainer_id
       JOIN clubs c ON c.id = l.club_id
       ORDER BY l.sort_order ASC`
    );

    const rows = result.rows;
    const current = rows[0]?.stage_name || 'Check back soon';
    const next = rows[1]?.stage_name || 'Check back soon';
    const club = rows[0]?.club_name || 'Main Venue';

    res.json({
      current,
      next,
      club,
      lounges: [
        {
          id: rows[0]?.club_id || 1,
          name: club,
          dancers: rows.map((row) => ({
            id: row.entertainer_id,
            stage_name: row.stage_name,
            sort_order: row.sort_order
          }))
        }
      ]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database Connection Error' });
  }
});

io.on('connection', (socket) => {
  console.log('A patron or entertainer connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

