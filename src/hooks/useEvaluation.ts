"use client";

import { useState, useCallback } from "react";
import { Evaluation } from "@/types";
import { evaluateLocally } from "@/lib/evaluator";

export function useEvaluation() {
  const [evaluation, setEvaluation] = useState<Omit<Evaluation, "id" | "runId" | "createdAt"> | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const evaluate = useCallback(async (input: string, output: string) => {
    setIsEvaluating(true);
    try {
      // Try server-side evaluation first
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, output }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation(data);
        return data;
      }

      // Fall back to local evaluation
      const result = evaluateLocally(input, output);
      setEvaluation(result);
      return result;
    } catch {
      const result = evaluateLocally(input, output);
      setEvaluation(result);
      return result;
    } finally {
      setIsEvaluating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setEvaluation(null);
  }, []);

  return { evaluation, isEvaluating, evaluate, reset };
}
