import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    // 1. Direct Brain Connection (Bypassing the SDK)
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a noir strategist. Briefly respond to: ${text}` }] }]
        })
      }
    );

    const data = await geminiResponse.json();
    const aiText = data.candidates[0].content.parts[0].text;

    // 2. Vocal Cords Connection (ElevenLabs)
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
    return new NextResponse(audioBuffer, { headers: { 'Content-Type': 'audio/mpeg' } });

  } catch (error) {
    console.error('Tactical Failure:', error);
    return NextResponse.json({ error: 'System Breach in API' }, { status: 500 });
  }
}