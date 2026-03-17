"use client";

import { useState, useCallback } from "react";
import { Prompt, Variable, ModelId, RunResult } from "@/types";
import { generateId } from "@/lib/utils";

const DEFAULT_PROMPT: Prompt = {
  id: generateId(),
  title: "Untitled Prompt",
  content: "",
  systemPrompt: "",
  variables: [],
  modelId: "claude-sonnet-4-20250514",
  temperature: 0.7,
  maxTokens: 2048,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function usePrompt() {
  const [prompt, setPrompt] = useState<Prompt>(DEFAULT_PROMPT);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateContent = useCallback((content: string) => {
    setPrompt((prev) => ({ ...prev, content, updatedAt: new Date().toISOString() }));
  }, []);

  const updateSystemPrompt = useCallback((systemPrompt: string) => {
    setPrompt((prev) => ({ ...prev, systemPrompt, updatedAt: new Date().toISOString() }));
  }, []);

  const updateTitle = useCallback((title: string) => {
    setPrompt((prev) => ({ ...prev, title, updatedAt: new Date().toISOString() }));
  }, []);

  const updateModel = useCallback((modelId: ModelId) => {
    setPrompt((prev) => ({ ...prev, modelId }));
  }, []);

  const updateTemperature = useCallback((temperature: number) => {
    setPrompt((prev) => ({ ...prev, temperature }));
  }, []);

  const updateMaxTokens = useCallback((maxTokens: number) => {
    setPrompt((prev) => ({ ...prev, maxTokens }));
  }, []);

  const addVariable = useCallback(() => {
    setPrompt((prev) => ({
      ...prev,
      variables: [...prev.variables, { key: "", value: "", description: "" }],
    }));
  }, []);

  const updateVariable = useCallback((index: number, variable: Variable) => {
    setPrompt((prev) => ({
      ...prev,
      variables: prev.variables.map((v, i) => (i === index ? variable : v)),
    }));
  }, []);

  const removeVariable = useCallback((index: number) => {
    setPrompt((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }));
  }, []);

  const runPrompt = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: prompt.content,
          systemPrompt: prompt.systemPrompt,
          variables: prompt.variables,
          modelId: prompt.modelId,
          temperature: prompt.temperature,
          maxTokens: prompt.maxTokens,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to run prompt");
      }

      const data = await response.json();
      setOutput(data.output);
      setRunResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsRunning(false);
    }
  }, [prompt]);

  const reset = useCallback(() => {
    setPrompt({ ...DEFAULT_PROMPT, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setOutput("");
    setRunResult(null);
    setError(null);
  }, []);

  return {
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
  };
}
