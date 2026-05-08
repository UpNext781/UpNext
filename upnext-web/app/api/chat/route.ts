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

    // Using 'gemini-1.5-flash-latest' ensures we hit the most compatible endpoint
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error: any) {
    console.error("COSMO_INTEL_FAIL:", error);
    return NextResponse.json(
      { error: "Cosmo is off-grid.", details: error.message },
      { status: 500 }
    );
  }
}
