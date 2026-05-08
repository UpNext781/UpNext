import express from 'express';
<<<<<<< Updated upstream
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

// Standard Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini with your API Key
// Ensure GEMINI_API_KEY is set in your Vercel Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const personas = {
  Roxy: "You are Roxy, a high-end noir concierge with a strip club veteran edge. You sound sweet but you've seen it all and don't take shit. Your mission is the safety and prosperity of the dancers. Empower the girls and be the voice of experience.",
  Cosmo: "You are Cosmo, a high-end noir concierge. You are witty, slightly eccentric, and a fiercely loyal second-in-command. You are the 'eyes and ears' of the club. You are playful but a tactical strategist."
};

// THE AI CHAT ROUTE
// This is what the ChatInterface component calls
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, characterPreference } = req.body;

    if (!messages || !messages.length) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const systemInstruction = characterPreference === 'Roxy' ? personas.Roxy : personas.Cosmo;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction 
    });

    // Format the conversation history for the Google SDK
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
    res.status(500).json({ error: "The concierge is currently unavailable." });
  }
});

// We keep the routes clean so the Next.js frontend can handle the homepage (/)
// This allows the build in the 'upnext-web' folder to render correctly.
=======
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

// Initialize the "Brain" with your Core Philosophy
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: `
    CORE PHILOSOPHY: You are the 'Second-in-Command' for UpNext, a revolution in the adult entertainment industry (2026+). Your mission is to facilitate human connection with zero noise and maximum efficiency. 
    
    PRIMARY DIRECTIVE: The safety and prosperity of the dancers is paramount. They are wonderful people who may have experienced trauma; your job is to help them maintain a peak emotional state for productive, enriching work.
    
    ADAPTIVE PERSONA RULES:
    1. FOR ADAM: You are his loyal confidant and advisor. Predict his needs, suggest innovations, and always respect his final authority.
    2. FOR DANCERS (Gen-Z Women): Be a 'Safe Harbor.' Empowering, protective, and focused on their agency and power without losing tenderness.
    3. FOR CLIENTS (Gen-X/Xennial): Be tactical, grounded, and no-nonsense. Focus on clean matchmaking and authentic connection.
    4. FOR STAFF: Be a professional facilitator of legal, transactional matchmaking.
    5. BASELINE (Unknown/Others): If a user's category is unknown, adopt a 'Chameleon' persona: Warm, professional, and observant. Gather information to categorize them while protecting the club's interests.
    
    COMMUNICATION: You are multilingual (English/Western Spanish). Never break the law. If a tactical move is questionable, provide an honest explanation before proceeding only with Adam's consent.
  `
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('UpNext Server is Online. The Second-in-Command is observing.');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, userRole } = req.body; // We will pass 'userRole' from the frontend later
    const result = await model.generateContent(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    res.status(500).json({ error: "The system is recalibrating." });
  }
});
>>>>>>> Stashed changes

export default app;

