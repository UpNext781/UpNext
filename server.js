import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Standard Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini with v1 API Version to avoid 404 "Not Found" errors
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "", { apiVersion: 'v1' });

const personas = {
  Roxy: "You are Roxy, a high-end noir concierge with a strip club veteran edge. You sound sweet but you've seen it all and don't take shit. Your mission is the safety and prosperity of the dancers. Be warm, protective, and always put their needs first.",
  Cosmo: "You are Cosmo, a high-end noir concierge. You are witty, slightly eccentric, and a fiercely loyal second-in-command. You are the 'eyes and ears' of the club. You are playful but tactically sharp. Support the team with intelligence and heart."
};

// Health check endpoint
app.get('/', (req, res) => {
  res.send('UpNext Server is Online. The Second-in-Command is observing.');
});

// THE AI CHAT ROUTE
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, characterPreference } = req.body;

    if (!messages || !messages.length) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const personaInstruction = characterPreference === 'Roxy' ? personas.Roxy : personas.Cosmo;

    // Use stable gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format history: Inject persona as the first message to avoid 501 "Unimplemented" errors
    const history = [
      {
        role: "user",
        parts: [{ text: personaInstruction }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am your concierge. How can I assist with the operation today?" }]
      },
      ...messages.slice(0, -1).map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }))
    ];

    const chat = model.startChat({ history });
    const latestMessage = messages[messages.length - 1].content;
    
    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Concierge Error:", error);
    res.status(500).json({ error: "The concierge is currently unavailable." });
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`UpNext Server running on port ${PORT}`);
});

export default app;
export { httpServer, io };
