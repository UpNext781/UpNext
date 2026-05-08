import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lastMessage,
    });

    // We send back just the text string. 
    // The frontend will handle the rest.
    return new Response(response.text);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Concierge offline" }, { status: 500 });
  }
}
