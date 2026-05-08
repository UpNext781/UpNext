import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

const genAI = new GoogleGenerativeAIStream(new GoogleGenAI(process.env.GEMINI_API_KEY || ""));

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  const geminiStream = await genAI.generateContentStream({
    model: "gemini-1.5-flash",
    contents: [{ role: "user", parts: [{ text: lastMessage }] }],
  });

  const stream = GoogleGenerativeAIStream(geminiStream);
  return new StreamingTextResponse(stream);
}