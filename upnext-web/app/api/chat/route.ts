import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    // 1. Validation
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    
    // Fallback to Lucas ID if no specific voiceId is sent from the UI
    const selectedVoiceId = voiceId || process.env.VOICE_ID_LUCAS;

    // 2. Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY as string,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2", // Multilingual v2 has the best "Noir" texture
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ElevenLabs Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
    }

    // 3. Return the raw audio buffer to the frontend
    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });

  } catch (error) {
    console.error('Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}