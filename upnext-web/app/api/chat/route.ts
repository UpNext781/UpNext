import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: lastMessage,
    });

    const text = result.response.text();

    // Wrapping the text in a simple JSON response that 
    // the Vercel AI SDK can easily parse for the UI
    return NextResponse.json({
      role: 'assistant',
      content: text
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Concierge offline" }, { status: 500 });
  }
}
