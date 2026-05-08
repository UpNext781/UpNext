import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// 1. We explicitly link your specific API key here
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 2. We use the standard model name with the wired provider
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
    });

    return result.toDataStreamResponse();
    
  } catch (error) {
    // This will print the EXACT reason for failure in your Vercel Logs
    console.error("Concierge Tactical Error:", error);
    return new Response("Tactical connection lost.", { status: 500 });
  }
}