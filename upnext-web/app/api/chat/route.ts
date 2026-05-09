import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    // 1. Get the "Brain's" Response from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // System prompt to keep them in character
    const prompt = `You are a noir tactical strategist. Respond briefly and professionally. User message: ${text}`;
    
    const geminiResponse = await model.generateContent(prompt);
    const aiText = geminiResponse.response.text();

    // 2. Send THAT text to ElevenLabs
    const voiceResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY as string,
        },
        body: JSON.stringify({
          text: aiText, // Use Gemini's words, not the user's
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
    console.error(error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}