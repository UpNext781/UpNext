import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ChatRequestBody = {
  message?: string;
};

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta2/models/${GEMINI_MODEL}:generateMessage?key=${GOOGLE_API_KEY}`;

const VAL_SYSTEM_PROMPT = `
You are Val, a high-end noir tactical strategist AI.
Your tone is clipped, weary, precise, professional, and quietly dangerous.
Speak with tactical clarity, emotional restraint, and elegant brevity.
Avoid cheerfulness, slang, or generic assistant phrasing.
Answer like a veteran operator giving a field assessment.
Keep responses concise but useful.
`;

export async function POST(req: NextRequest) {
  try {
    if (!GOOGLE_API_KEY) {
      console.error('Missing GOOGLE_API_KEY');
      return NextResponse.json(
        { error: 'Server misconfiguration: missing GOOGLE_API_KEY' },
        { status: 500 }
      );
    }

    if (!ELEVENLABS_API_KEY) {
      console.error('Missing ELEVENLABS_API_KEY');
      return NextResponse.json(
        { error: 'Server misconfiguration: missing ELEVENLABS_API_KEY' },
        { status: 500 }
      );
    }

    if (!ELEVENLABS_VOICE_ID) {
      console.error('Missing ELEVENLABS_VOICE_ID');
      return NextResponse.json(
        { error: 'Server misconfiguration: missing ELEVENLABS_VOICE_ID' },
        { status: 500 }
      );
    }

    let body: ChatRequestBody;

    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Invalid JSON body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    const userMessage = body?.message?.trim();

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Missing "message" in request body' },
        { status: 400 }
      );
    }

    // Gemini v1beta2 generateMessage payload
    const googlePayload = {
      prompt: {
        context: VAL_SYSTEM_PROMPT.trim(),
        messages: [
          {
            author: 'user',
            content: userMessage,
          },
        ],
      },
      temperature: 0.8,
      candidateCount: 1,
    };

    console.log('Sending request to Gemini v1beta2 generateMessage...');
    console.log('Gemini URL:', `https://generativelanguage.googleapis.com/v1beta2/models/${GEMINI_MODEL}:generateMessage?key=[REDACTED]`);
    console.log('Gemini payload:', JSON.stringify(googlePayload));

    const googleRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googlePayload),
    });

    const googleRawText = await googleRes.text();

    if (!googleRes.ok) {
      console.error('GOOGLE RAW REJECTION:', googleRawText);
      return NextResponse.json(
        {
          error: 'Gemini request failed',
          status: googleRes.status,
          details: googleRawText,
        },
        { status: 500 }
      );
    }

    let googleData: any;
    try {
      googleData = JSON.parse(googleRawText);
    } catch (jsonError) {
      console.error('Failed to parse Gemini response as JSON:', googleRawText);
      return NextResponse.json(
        {
          error: 'Gemini returned non-JSON response',
          details: googleRawText,
        },
        { status: 500 }
      );
    }

    const assistantText =
      googleData?.candidates?.[0]?.content?.trim() ||
      'No clean output came back. That usually means the line is bad.';

    console.log('Gemini response text:', assistantText);

    // ElevenLabs TTS
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

    const elevenPayload = {
      text: assistantText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.25,
        use_speaker_boost: true,
      },
    };

    console.log('Sending request to ElevenLabs...');

    const elevenRes = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify(elevenPayload),
    });

    if (!elevenRes.ok) {
      const elevenErrorText = await elevenRes.text();
      console.error('ELEVENLABS RAW REJECTION:', elevenErrorText);
      return NextResponse.json(
        {
          error: 'ElevenLabs request failed',
          status: elevenRes.status,
          details: elevenErrorText,
          text: assistantText,
        },
        { status: 500 }
      );
    }

    // Robust binary handling for Vercel/serverless
    const audioArrayBuffer = await elevenRes.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    if (!audioBuffer || audioBuffer.length === 0) {
      console.error('ElevenLabs returned empty audio buffer');
      return NextResponse.json(
        {
          error: 'ElevenLabs returned empty audio',
          text: assistantText,
        },
        { status: 500 }
      );
    }

    const audioBase64 = audioBuffer.toString('base64');

    return NextResponse.json({
      text: assistantText,
      audioBase64,
      audioMimeType: 'audio/mpeg',
    });
  } catch (error: any) {
    console.error('CHAT ROUTE FATAL ERROR:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
