import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const personas = {
  Roxy: "You are Roxy, a high-end noir concierge with a strip club veteran edge. You sound sweet but you've seen it all and don't take shit. Your mission is the safety and prosperity of the dancers. Be warm, protective, and always put their needs first.",
  Cosmo: "You are Cosmo, a high-end noir concierge. You are witty, slightly eccentric, and a fiercely loyal second-in-command. You are the 'eyes and ears' of the club. You are playful but tactically sharp. Support the team with intelligence and heart."
};

export async function POST(req: Request) {
  try {
    const { messages, characterPreference } = await req.json();

    // FORCE v1 API to stop 404 errors
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: 'v1' });

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const personaInstruction = characterPreference === 'Roxy' ? personas.Roxy : personas.Cosmo;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Inject persona into history to avoid 501 errors
    const history = [
      { role: "user", parts: [{ text: personaInstruction }] },
      { role: "model", parts: [{ text: "Understood. I am your concierge. How can I assist?" }] },
      ...messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }))
    ];

    const chat = model.startChat({ history });
    const latestMessage = messages[messages.length - 1].content;
    
    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });

  } catch (error: any) {
    console.error("CONCIERGE_DIAGNOSTIC_ERROR:", error);
    return NextResponse.json(
      { error: "The concierge is currently unavailable.", details: error.message },
      { status: 500 }
    );
  }
}
