import { NextRequest, NextResponse } from "next/server";
import {
  getModel,
  calculateCost,
  interpolateVariables,
  runAnthropicModel,
  runOpenAIModel,
  runGeminiModel,
} from "@/lib/ai-providers";
import { ModelId, Variable } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      content,
      systemPrompt = "",
      variables = [],
      modelId,
      temperature = 0.7,
      maxTokens = 2048,
    } = body as {
      content: string;
      systemPrompt?: string;
      variables?: Variable[];
      modelId: ModelId;
      temperature?: number;
      maxTokens?: number;
    };

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const model = getModel(modelId);
    if (!model) {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    // Interpolate variables
    const resolvedContent = interpolateVariables(content, variables);
    const resolvedSystem = interpolateVariables(systemPrompt, variables);

    const startTime = Date.now();
    let output = "";
    let inputTokens = 0;
    let outputTokens = 0;

    // Get API key from headers or env
    const getApiKey = (provider: string) => {
      const headerKey = request.headers.get(`x-${provider}-key`);
      if (headerKey) return headerKey;
      const envMap: Record<string, string> = {
        anthropic: process.env.ANTHROPIC_API_KEY || "",
        openai: process.env.OPENAI_API_KEY || "",
        gemini: process.env.GEMINI_API_KEY || "",
      };
      return envMap[provider] || "";
    };

    const apiKey = getApiKey(model.provider);
    if (!apiKey) {
      return NextResponse.json(
        { error: `No API key configured for ${model.provider}. Add it in Settings.` },
        { status: 400 }
      );
    }

    if (model.provider === "anthropic") {
      const response = await runAnthropicModel(
        apiKey,
        model.id,
        resolvedSystem,
        resolvedContent,
        temperature,
        maxTokens
      );
      output = response.content?.[0]?.text || "";
      inputTokens = response.usage?.input_tokens || 0;
      outputTokens = response.usage?.output_tokens || 0;
    } else if (model.provider === "openai") {
      const response = await runOpenAIModel(
        apiKey,
        model.id,
        resolvedSystem,
        resolvedContent,
        temperature,
        maxTokens
      );
      output = response.choices?.[0]?.message?.content || "";
      inputTokens = response.usage?.prompt_tokens || 0;
      outputTokens = response.usage?.completion_tokens || 0;
    } else if (model.provider === "gemini") {
      const response = await runGeminiModel(
        apiKey,
        model.id,
        resolvedSystem,
        resolvedContent,
        temperature,
        maxTokens
      );
      output = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      inputTokens = response.usageMetadata?.promptTokenCount || 0;
      outputTokens = response.usageMetadata?.candidatesTokenCount || 0;
    }

    const latencyMs = Date.now() - startTime;
    const cost = calculateCost(model, inputTokens, outputTokens);

    return NextResponse.json({
      output,
      modelId,
      inputTokens,
      outputTokens,
      latencyMs,
      cost,
      input: resolvedContent,
      systemPrompt: resolvedSystem,
      variables,
      temperature,
      maxTokens,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
