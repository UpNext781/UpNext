import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Link it to your exact Vercel Environment Variable
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'), 
      messages,
    });

    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error("Concierge Error:", error);
    return new Response("Tactical connection lost.", { status: 500 });
  }
}