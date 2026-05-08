import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

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

    // This bypasses the 'toDataStreamResponse' error by 
    // handing the text stream directly to the frontend.
    return new Response(result.textStream);
    
  } catch (error) {
    console.error("Concierge Error:", error);
    return new Response("Tactical connection lost.", { status: 500 });
  }
}