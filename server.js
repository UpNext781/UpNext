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

app.use(cors());
app.use(express.json());

// Initialize Gemini with the latest production-stable version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const personas = {
  Roxy: "You are Roxy, a high-end noir concierge with a strip club veteran edge. You sound sweet but you've seen it all and don't take shit. Your mission is the safety and prosperity of the dancers. Be warm, protective, and always put their needs first.",
  Cosmo: "You are Cosmo, a high-end noir concierge. You are witty, slightly eccentric, and a fiercely loyal second-in-command. You are playfull but tactically sharp. Support the team with intelligence and heart."
};

app.get('/', (req, res) => {
  res.send('UpNext Backend is Online. Operation Secure.');
});

// THE AI CHAT ROUTE (Root Backend)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, characterPreference } = req.body;

    if (!messages || !messages.length) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const personaInstruction = characterPreference === 'Roxy' ? personas.Roxy : personas.Cosmo;

    // Use the 2026 stable model: gemini-2.0-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Format history for the Chat interface
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
        parts: [{ text: m.content || m.text }],
      }))
    ];

    const chat = model.startChat({ history });
    const latestMessage = messages[messages.length - 1].content || messages[messages.length - 1].text;
    
    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Concierge Backend Error:", error);
    res.status(500).json({ error: "The concierge is currently unavailable." });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected to Real-Time Bridge:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`UpNext Root Backend running on port ${PORT}`);
});

export default app;
export { httpServer, io };
