import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    // THE NAKED HANDSHAKE: No beta, no latest, just the core v1 path
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: text }] }]
        })
      }
    );

    const data = await geminiResponse.json();

    if (data.error) {
      console.error('GOOGLE RAW REJECTION:', JSON.stringify(data, null, 2));
      return NextResponse.json({ error: 'Google Refused', detail: data }, { status: 500 });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    // 2. Vocal Cords (ElevenLabs)
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
    return NextResponse.json({ error: 'Internal Crash' }, { status: 500 });
  }
}
