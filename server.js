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
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Standard Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const personas = {
  Roxy: "You are Roxy, a high-end noir concierge with a strip club veteran edge. You sound sweet but you've seen it all and don't take shit. Your mission is the safety and prosperity of the dancers. Be warm, protective, and always put their needs first.",
  Cosmo: "You are Cosmo, a high-end noir concierge. You are witty, slightly eccentric, and a fiercely loyal second-in-command. You are the 'eyes and ears' of the club. You are playful but tactically sharp. Support the team with intelligence and heart."
};

// Health check endpoint
app.get('/', (req, res) => {
  res.send('UpNext Server is Online. The Second-in-Command is observing.');
});

// THE AI CHAT ROUTE
// This is what the ChatInterface component calls
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, characterPreference } = req.body;

    if (!messages || !messages.length) {
      return res.status(400).json({ error: "No messages provided" });
    }

    // Get the persona instruction
    const personaInstruction = characterPreference === 'Roxy' ? personas.Roxy : personas.Cosmo;

    // Initialize model WITHOUT systemInstruction parameter (causes 501 error)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });

    // Build conversation history with persona as first message
    // The persona instruction goes in as the first system message
    const history = [
      {
        role: "user",
        parts: [{ text: personaInstruction }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I'm ready to assist as your concierge." }]
      },
      // Then add the actual conversation history
      ...messages.slice(0, -1).map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }))
    ];

    // Start chat with the full history including persona
    const chat = model.startChat({ history });
    
    // Send only the latest user message
    const result = await chat.sendMessage(messages[messages.length - 1].content);
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

// We keep the routes clean so the Next.js frontend can handle the homepage (/)
// This allows the build in the 'upnext-web' folder to render correctly.

export default app;
export { httpServer, io };
