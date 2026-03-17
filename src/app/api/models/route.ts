import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai-providers";

export async function GET() {
  const availableModels = MODELS.map((model) => {
    const envMap: Record<string, string | undefined> = {
      anthropic: process.env.ANTHROPIC_API_KEY,
      openai: process.env.OPENAI_API_KEY,
      gemini: process.env.GEMINI_API_KEY,
    };

    return {
      ...model,
      available: !!envMap[model.provider],
    };
  });

  return NextResponse.json({ models: availableModels });
}
