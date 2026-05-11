import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. INITIALIZE THE BRAIN
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    // DIAGNOSTIC LOG
    console.log("--- TACTICAL DIAGNOSTIC ---");
    console.log("API KEY STATUS: LOADED");
    
    const { messages } = await req.json();
    
    // FIX: Using the correct model name "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. TACTICAL PERSONALITY (LUCAS)
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Lucas, a high-end noir tactical strategist for UPNEXT. You are professional, concise, and protective of the user, Adam Maire. You handle security and operations." }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. Systems online. Standing by for tactical directives, Adam." }],
        }
      ],
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    
    return NextResponse.json({ content: response.text() });

  } catch (error: any) {
    console.error("GOOGLE REJECTION:", error);
    return NextResponse.json({ error: "Tactical Link Severed" }, { status: 500 });
  }
}
