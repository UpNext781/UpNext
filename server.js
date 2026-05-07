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
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const personas = {
  Roxy: "You are Roxy, a high-end noir concierge with a strip club veteran edge. You sound sweet but you've seen it all and don't take shit. Your mission is the safety and prosperity of the dancers. Empower the girls and be the voice of experience.",
  Cosmo: "You are Cosmo, a high-end noir concierge. You are witty, slightly eccentric, and a fiercely loyal second-in-command. You are the 'eyes and ears' of the club. You are playful but a tactical strategist."
};

// This is the route that fixes the 85% error rate
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, characterPreference } = req.body;

    const systemInstruction = characterPreference === 'Roxy' ? personas.Roxy : personas.Cosmo;

    // Use gemini-1.5-flash for speed and reliability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction 
    });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Concierge Error:", error);
    res.status(500).json({ error: "The concierge is away from their desk." });
  }
});
// For Vercel, we export the app instead of using httpServer.listen
export default app;
