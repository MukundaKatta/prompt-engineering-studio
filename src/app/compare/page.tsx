"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import ComparisonGrid from "@/components/ComparisonGrid";
import { ComparisonItem, ModelId } from "@/types";
import { MODELS } from "@/lib/ai-providers";
import { cn } from "@/lib/utils";
import { Play, Plus, X } from "lucide-react";

export default function ComparePage() {
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<ModelId[]>([
    "claude-sonnet-4-20250514",
    "gpt-4o",
  ]);
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const toggleModel = (modelId: ModelId) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, modelId];
    });
  };

  const runComparison = useCallback(async () => {
    if (!prompt.trim() || selectedModels.length === 0) return;
    setIsRunning(true);

    const newItems: ComparisonItem[] = selectedModels.map((modelId) => ({
      modelId,
      isLoading: true,
    }));
    setItems(newItems);

    const results = await Promise.allSettled(
      selectedModels.map(async (modelId) => {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: prompt,
            systemPrompt,
            variables: [],
            modelId,
            temperature: 0.7,
            maxTokens: 2048,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed");
        }
        return res.json();
      })
    );

    const updatedItems: ComparisonItem[] = selectedModels.map((modelId, idx) => {
      const result = results[idx];
      if (result.status === "fulfilled") {
        return { modelId, result: result.value, isLoading: false };
      }
      return {
        modelId,
        isLoading: false,
        error: result.reason?.message || "Unknown error",
      };
    });

    setItems(updatedItems);
    setIsRunning(false);
  }, [prompt, systemPrompt, selectedModels]);

  return (
    <div className="flex flex-col">
      <Header
        title="Model Comparison"
        subtitle="Compare outputs across multiple models"
      />

      <div className="p-6">
        {/* Model Selection */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-white">
            Select Models (max 4)
          </h3>
          <div className="flex flex-wrap gap-2">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                  selectedModels.includes(model.id)
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                    : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                )}
              >
                {selectedModels.includes(model.id) ? (
                  <X className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                {model.name}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-gray-400">
            System Prompt
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Optional system instructions..."
            className="h-16 w-full resize-none rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-gray-400">
            User Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt to compare across models..."
            className="h-32 w-full resize-none rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <button
          onClick={runComparison}
          disabled={isRunning || !prompt.trim() || selectedModels.length === 0}
          className="mb-6 flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {isRunning ? "Running comparison..." : "Run Comparison"}
        </button>

        {/* Results Grid */}
        <ComparisonGrid items={items} />
      </div>
    </div>
  );
}
