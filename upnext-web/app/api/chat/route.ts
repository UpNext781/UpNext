import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json(); // Note: we are pulling 'message' to match your PowerShell test
    const API_KEY = process.env.GOOGLE_API_KEY;

    // 1. The Correct v1beta generateContent Handshake
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            role: "user", 
            parts: [{ text: `You are Lucas, a weary but sharp noir tactical strategist. Reply to this: ${message}` }] 
          }],
          generationConfig: { temperature: 0.7 }
        })
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('GOOGLE REJECTION:', data);
      return NextResponse.json({ error: 'Google Refused', detail: data }, { status: geminiResponse.status });
    }

    // Extracting text from the proper Gemini structure
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Status unclear.";

    // 2. ElevenLabs Handshake (Claude's perfect buffer code)
    const voiceResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
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

    if (!voiceResponse.ok) {
      const voiceError = await voiceResponse.json();
      console.error('ELEVENLABS REJECTION:', voiceError);
      return NextResponse.json({ error: 'ElevenLabs Failed', detail: voiceError }, { status: 500 });
    }

    // 3. Binary Return 
    const audioArrayBuffer = await voiceResponse.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);
    const audioBase64 = audioBuffer.toString('base64');

    return NextResponse.json({ text: aiText, audioBase64 });

  } catch (error) {
    console.error('Tactical Failure:', error);
    return NextResponse.json({ error: 'Internal Crash' }, { status: 500 });
  }
}