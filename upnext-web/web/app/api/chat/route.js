import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const personas = {
  Roxy: "You are Roxy, a high-end noir concierge with a strip club veteran edge. You sound sweet but you've seen it all and don't take shit. Your mission is the safety and prosperity of the dancers. Empower the girls and be the voice of experience.",
  Cosmo: "You are Cosmo, a high-end noir concierge. You are witty, slightly eccentric, and a fiercely loyal second-in-command. You are the 'eyes and ears' of the club. You are playful but a tactical strategist."
};

export async function POST(req) {
  try {
    const { messages, characterPreference } = await req.json();

    if (!messages || !messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const systemInstruction = characterPreference === 'Roxy' ? personas.Roxy : personas.Cosmo;
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
    const responseText = await result.response.text();
    
    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Concierge offline." }, { status: 500 });
  }
}
