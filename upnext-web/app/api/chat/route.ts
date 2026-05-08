import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the new client using your existing environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    // Parse the incoming request from your ChatInterface
    const body = await req.json();

    // Extract the message. This handles standard { prompt: "..." } 
    // or Vercel's { messages: [{ role: "user", content: "..." }] } arrays.
    const userMessage = body.prompt || 
                        (body.messages && body.messages[body.messages.length - 1]?.content) || 
                        "";

    if (!userMessage) {
      return NextResponse.json({ error: "Message content is required." }, { status: 400 });
    }

    // Generate the response using the updated model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
    });

    // Send the response text back to the frontend
    return NextResponse.json({
      text: response.text
    });

  } catch (error) {
    console.error("Concierge API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error generating response." },
      { status: 500 }
    );
  }
}
