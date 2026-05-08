import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We explicitly tell the AI its name and personality here
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: "Your name is Lucas. You are a high-end noir tactical strategist and protector for the UpNext platform. You are professional, concise, and focused on security and discretion."
    });

    const result = await model.generateContent(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error: any) {
    console.error("LUCAS_INTEL_FAIL:", error);
    return NextResponse.json(
      { error: "Lucas is currently off-grid.", details: error.message },
      { status: 500 }
    );
  }
}
