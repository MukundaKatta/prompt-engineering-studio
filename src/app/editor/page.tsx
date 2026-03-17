"use client";

import { useEffect, useCallback } from "react";
import Header from "@/components/Header";
import PromptEditor from "@/components/PromptEditor";
import VariablePanel from "@/components/VariablePanel";
import ModelSelector from "@/components/ModelSelector";
import OutputPanel from "@/components/OutputPanel";
import MetricsCard from "@/components/MetricsCard";
import { usePrompt } from "@/hooks/usePrompt";
import { useEvaluation } from "@/hooks/useEvaluation";
import { showToast } from "@/components/Toast";
import { Play, RotateCcw, Save } from "lucide-react";

export default function EditorPage() {
  const {
    prompt,
    output,
    isRunning,
    runResult,
    error,
    updateContent,
    updateSystemPrompt,
    updateTitle,
    updateModel,
    updateTemperature,
    updateMaxTokens,
    addVariable,
    updateVariable,
    removeVariable,
    runPrompt,
    reset,
  } = usePrompt();

  const { evaluation, evaluate } = useEvaluation();

  const handleRun = useCallback(async () => {
    await runPrompt();
    showToast("info", "Prompt executed");
  }, [runPrompt]);

  // Auto-evaluate when output changes
  useEffect(() => {
    if (output && prompt.content) {
      evaluate(prompt.content, output);
    }
  }, [output, prompt.content, evaluate]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRun]);

  return (
    <div className="flex h-screen flex-col">
      <Header title="Prompt Editor" subtitle="Write and test prompts" />

      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-gray-700 bg-gray-900 px-6 py-2">
        <input
          type="text"
          value={prompt.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="h-8 w-64 rounded border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          placeholder="Prompt title..."
        />
        <div className="flex-1" />
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          onClick={() => showToast("info", "Prompt saved locally")}
          className="flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </button>
        <button
          onClick={handleRun}
          disabled={isRunning || !prompt.content}
          className="flex items-center gap-1.5 rounded-md bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="h-3.5 w-3.5" />
          {isRunning ? "Running..." : "Run"}
          <kbd className="ml-1 rounded bg-indigo-600 px-1 py-0.5 text-xs">
            Cmd+Enter
          </kbd>
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          {/* System Prompt */}
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-400">
              System Prompt
            </label>
            <textarea
              value={prompt.systemPrompt}
              onChange={(e) => updateSystemPrompt(e.target.value)}
              placeholder="Optional system instructions..."
              className="h-20 w-full resize-none rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* User Prompt */}
          <div className="mb-3 flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-400">
              User Prompt
            </label>
            <PromptEditor
              value={prompt.content}
              onChange={updateContent}
              onRun={handleRun}
              height="100%"
            />
          </div>

          {/* Parameters */}
          <div className="flex items-center gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Temperature</label>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={prompt.temperature}
                onChange={(e) => updateTemperature(parseFloat(e.target.value))}
                className="w-32"
              />
              <span className="ml-2 text-xs text-gray-400">{prompt.temperature}</span>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Max Tokens</label>
              <input
                type="number"
                value={prompt.maxTokens}
                onChange={(e) => updateMaxTokens(parseInt(e.target.value) || 256)}
                className="h-8 w-24 rounded border border-gray-700 bg-gray-800 px-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Sidebar panels */}
        <div className="flex w-80 flex-col gap-3 overflow-auto border-l border-gray-700 p-4">
          <ModelSelector value={prompt.modelId} onChange={updateModel} />

          <VariablePanel
            variables={prompt.variables}
            onAdd={addVariable}
            onUpdate={updateVariable}
            onRemove={removeVariable}
          />

          {/* Output */}
          <div className="flex-1">
            <OutputPanel
              output={output}
              isLoading={isRunning}
              error={error}
              result={runResult}
            />
          </div>

          {/* Evaluation Metrics */}
          {evaluation && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-gray-400">Evaluation</h3>
              <div className="grid grid-cols-2 gap-2">
                <MetricsCard label="Relevance" value={evaluation.relevance} size="sm" />
                <MetricsCard label="Coherence" value={evaluation.coherence} size="sm" />
                <MetricsCard label="Accuracy" value={evaluation.accuracy} size="sm" />
                <MetricsCard label="Creativity" value={evaluation.creativity} size="sm" />
              </div>
              <MetricsCard label="Overall" value={evaluation.overall} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
