import express from 'express';
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

export default app;

