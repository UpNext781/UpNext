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

    // This sends raw text, which matches what your frontend is expecting
    return new Response(response.text);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Concierge offline" }, { status: 500 });
  }
}
