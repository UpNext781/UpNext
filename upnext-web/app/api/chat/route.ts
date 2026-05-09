import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the Brain (Gemini)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

    // 2. Determine Persona based on the Voice ID
    // We use your custom IDs to set the "attitude" of the response
    const isLucas = voiceId === 'dW1ILwbkaQ3MZyEBwl0f';
    const personaPrompt = isLucas 
      ? "You are Lucas, a gritty noir tactical strategist. Be brief, authoritative, and clinical." 
      : "You are Roxy, a sophisticated and observant noir concierge. Be polished, discreet, and helpful.";

    // 3. Generate the AI Response
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(`${personaPrompt} User message: ${text}`);
    const aiText = result.response.text();

    // 4. Send the AI's words to the Vocal Cords (ElevenLabs)
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
            style: 0.0,
            use_speaker_boost: true,
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