"use client";

import { AIModel, ModelId } from "@/types";
import { MODELS } from "@/lib/ai-providers";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  value: ModelId;
  onChange: (modelId: ModelId) => void;
  showPricing?: boolean;
}

export default function ModelSelector({
  value,
  onChange,
  showPricing = true,
}: ModelSelectorProps) {
  const providerColors: Record<string, string> = {
    anthropic: "text-orange-400",
    openai: "text-green-400",
    gemini: "text-blue-400",
  };

  const providerLabels: Record<string, string> = {
    anthropic: "Anthropic",
    openai: "OpenAI",
    gemini: "Google",
  };

  const grouped = MODELS.reduce<Record<string, AIModel[]>>((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = [];
    acc[model.provider].push(model);
    return acc;
  }, {});

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <h3 className="mb-3 text-sm font-medium text-white">Model</h3>
      <div className="space-y-3">
        {Object.entries(grouped).map(([provider, models]) => (
          <div key={provider}>
            <p className={cn("mb-1 text-xs font-medium", providerColors[provider])}>
              {providerLabels[provider]}
            </p>
            <div className="space-y-1">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => onChange(model.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                    value === model.id
                      ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/50"
                      : "text-gray-300 hover:bg-gray-700"
                  )}
                >
                  <span>{model.name}</span>
                  {showPricing && (
                    <span className="text-xs text-gray-500">
                      ${model.inputPricePerMToken}/M in
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
