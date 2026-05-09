import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// --- DISCOVERY ROUTE (GET) ---
// This allows us to see exactly what models Google is offering your key.
export async function GET() {
  try {
    const models = await genAI.listModels();
    return NextResponse.json(models);
  } catch (error) {
    console.error("Discovery Error:", error);
    return NextResponse.json({ error: "Failed to list models" }, { status: 500 });
  }
}

// --- CHAT ROUTE (POST) ---
export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    // 1. Initialize Gemini (The Brain)
    // We are using the most basic ID to see if it bypasses the 404
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const persona = voiceId === 'dW1ILwbkaQ3MZyEBwl0f' 
      ? "You are Lucas, a tactical noir strategist." 
      : "You are Roxy, a sophisticated noir concierge.";

    const result = await model.generateContent(`${persona}\n\nUser: ${text}`);
    const aiText = result.response.text();

    // 2. Call ElevenLabs (The Vocal Cords)
    const voiceResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY as string,
        },
        body: JSON.stringify({
          text: aiText,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.8 },
        }),
      }
    );

    const audioBuffer = await voiceResponse.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });

  } catch (error) {
    // This will print the EXACT error message to your Vercel Logs
    console.error('Tactical Error Detail:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}