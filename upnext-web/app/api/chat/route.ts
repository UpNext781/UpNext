import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: lastMessage,
    });

    return new Response(result.response.text());

  } catch (error) {
    console.error("Concierge Error:", error);
    return new Response("Tactical connection lost.", { status: 500 });
  }
}