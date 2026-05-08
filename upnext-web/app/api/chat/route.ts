import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      // We added '-latest' because Google was giving a 404 on the short name
      model: google('gemini-1.5-flash-latest'),
      messages,
    });

    // This is the standard command that should work now that your packages are updated
    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error("Concierge Error:", error);
    return new Response("Tactical connection lost.", { status: 500 });
  }
}