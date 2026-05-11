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

app.use(cors());
app.use(express.json());

// Initialize with Gemini 3.1 Stable (2026)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const personas = {
  Roxy: "You are Roxy, a high-end noir concierge with a strip club veteran edge. You sound sweet but you've seen it all. Your mission is the safety and prosperity of the dancers.",
  Cosmo: "You are Cosmo, a witty second-in-command. Playful but tactically sharp. Support the team with intelligence and heart."
};

app.get('/', (req, res) => res.send('UpNext Backend Online. Operation Secure.'));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, characterPreference } = req.body;
    if (!messages || !messages.length) return res.status(400).json({ error: "No messages" });

    const personaInstruction = characterPreference === 'Roxy' ? personas.Roxy : personas.Cosmo;
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const history = [
      { role: "user", parts: [{ text: personaInstruction }] },
      { role: "model", parts: [{ text: "Understood. Standing by for instructions." }] },
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
    console.error("Concierge Error:", error);
    res.status(500).json({ error: "Voice module offline." });
  }
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`UpNext Root Backend active on port ${PORT}`));
