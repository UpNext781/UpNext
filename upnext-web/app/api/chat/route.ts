import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // 1. Fix: Support both 'text' (from your UI) and 'message' (from your tests)
    const promptText = body.text || body.message;
    
    // 2. Fix: Check both common API key names to be safe
    const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    
    // 3. Fix: Use the 'voiceId' sent from the frontend, or fall back to env
    const voiceId = body.voiceId || process.env.ELEVENLABS_VOICE_ID;

    if (!promptText) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // 4. Fix: Switched to the stable /v1/ endpoint to resolve the 404
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            role: "user", 
            parts: [{ text: `You are Lucas, a weary but sharp noir tactical strategist. Reply to this: ${promptText}` }] 
          }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
        })
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('GOOGLE REJECTION:', data);
      return NextResponse.json({ error: 'Google Refused', detail: data }, { status: geminiResponse.status });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Status unclear.";

    // 5. ElevenLabs Handshake
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

    if (!voiceResponse.ok) {
      const voiceError = await voiceResponse.json();
      console.error('ELEVENLABS REJECTION:', voiceError);
      return NextResponse.json({ error: 'ElevenLabs Failed', detail: voiceError }, { status: 500 });
    }

    const audioArrayBuffer = await voiceResponse.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);
    const audioBase64 = audioBuffer.toString('base64');

    return NextResponse.json({ text: aiText, audioBase64 });

  } catch (error) {
    console.error('Tactical Failure:', error);
    return NextResponse.json({ error: 'Internal Crash' }, { status: 500 });
  }
}
