import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Force the SDK to use the correct model and settings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

    // 1. Setup the Persona
    const isLucas = voiceId === 'dW1ILwbkaQ3MZyEBwl0f';
    const persona = isLucas 
      ? "You are Lucas, a gritty noir tactical strategist. Be brief, authoritative, and clinical. Keep responses under 30 words." 
      : "You are Roxy, a sophisticated noir concierge. Be polished, observant, and helpful. Keep responses under 30 words.";

    // 2. Initialize Gemini 1.5 Flash (The Brain)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(`${persona}\n\nUser: ${text}`);
    const aiText = result.response.text();

    // 3. Call ElevenLabs (The Vocal Cords)
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
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
          },
        }),
      }
    );

    if (!voiceResponse.ok) {
      const errorData = await voiceResponse.json();
      console.error('ElevenLabs Error:', errorData);
      return NextResponse.json({ error: 'Voice synthesis failed' }, { status: 500 });
    }

    const audioBuffer = await voiceResponse.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });

  } catch (error) {
    console.error('Tactical Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}