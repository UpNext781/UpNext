import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get the most recent message from the user
    const lastMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lastMessage,
    });

    const text = response.text;

    // This is the "Magic" part: 
    // It formats the answer exactly how your ChatInterface.tsx expects it
    return NextResponse.json([
      {
        id: Math.random().toString(),
        role: 'assistant',
        content: text,
      }
    ]);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to connect to concierge" }, { status: 500 });
  }
}

