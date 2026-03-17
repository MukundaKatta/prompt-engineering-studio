"use client";

import { Loader2 } from "lucide-react";
import { ComparisonItem } from "@/types";
import { getModel } from "@/lib/ai-providers";
import { formatCost, formatLatency, formatTokens, cn } from "@/lib/utils";
import MetricsCard from "./MetricsCard";

interface ComparisonGridProps {
  items: ComparisonItem[];
}

export default function ComparisonGrid({ items }: ComparisonGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800">
        <p className="text-sm text-gray-500">
          Select models and run a comparison to see results side by side.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        items.length <= 2 ? "grid-cols-2" : items.length === 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
      )}
    >
      {items.map((item) => {
        const model = getModel(item.modelId);
        return (
          <div
            key={item.modelId}
            className="flex flex-col rounded-lg border border-gray-700 bg-gray-800"
          >
            <div className="border-b border-gray-700 px-4 py-3">
              <h4 className="text-sm font-medium text-white">
                {model?.name || item.modelId}
              </h4>
              <p className="text-xs text-gray-500">{model?.provider}</p>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {item.isLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Running...</span>
                </div>
              ) : item.error ? (
                <p className="text-sm text-red-400">{item.error}</p>
              ) : item.result ? (
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-300">
                  {item.result.output}
                </pre>
              ) : (
                <p className="text-xs text-gray-500">Waiting...</p>
              )}
            </div>

            {item.result && (
              <div className="space-y-1 border-t border-gray-700 p-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tokens: {formatTokens(item.result.inputTokens + item.result.outputTokens)}</span>
                  <span>{formatLatency(item.result.latencyMs)}</span>
                  <span>{formatCost(item.result.cost)}</span>
                </div>
              </div>
            )}

            {item.evaluation && (
              <div className="space-y-1 border-t border-gray-700 p-3">
                <MetricsCard label="Overall" value={item.evaluation.overall} size="sm" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
