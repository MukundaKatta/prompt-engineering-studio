"use client";

import { Copy, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { RunResult } from "@/types";
import { formatCost, formatLatency, formatTokens, copyToClipboard } from "@/lib/utils";

interface OutputPanelProps {
  output: string;
  isLoading: boolean;
  error?: string | null;
  result?: RunResult | null;
}

export default function OutputPanel({
  output,
  isLoading,
  error,
  result,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
        <h3 className="text-sm font-medium text-white">Output</h3>
        {output && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Running prompt...</span>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : output ? (
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
            {output}
          </pre>
        ) : (
          <p className="text-sm text-gray-500">
            Output will appear here after running your prompt. Press Cmd+Enter to run.
          </p>
        )}
      </div>

      {result && (
        <div className="flex items-center gap-4 border-t border-gray-700 px-4 py-2">
          <span className="text-xs text-gray-500">
            Tokens: {formatTokens(result.inputTokens)} in / {formatTokens(result.outputTokens)} out
          </span>
          <span className="text-xs text-gray-500">
            Latency: {formatLatency(result.latencyMs)}
          </span>
          <span className="text-xs text-gray-500">
            Cost: {formatCost(result.cost)}
          </span>
        </div>
      )}
    </div>
  );
}
