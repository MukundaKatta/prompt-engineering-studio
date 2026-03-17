import { Evaluation, RunResult } from "@/types";

export interface EvaluationCriteria {
  relevance: { weight: number; description: string };
  coherence: { weight: number; description: string };
  accuracy: { weight: number; description: string };
  creativity: { weight: number; description: string };
}

export const DEFAULT_CRITERIA: EvaluationCriteria = {
  relevance: {
    weight: 0.3,
    description: "How relevant is the output to the input prompt",
  },
  coherence: {
    weight: 0.25,
    description: "How well-structured and logically consistent is the output",
  },
  accuracy: {
    weight: 0.25,
    description: "How factually accurate and precise is the output",
  },
  creativity: {
    weight: 0.2,
    description: "How creative and engaging is the output",
  },
};

export function evaluateLocally(
  input: string,
  output: string
): Omit<Evaluation, "id" | "runId" | "createdAt"> {
  const outputLen = output.length;
  const inputLen = input.length;

  // Length ratio heuristic
  const lengthRatio = Math.min(outputLen / Math.max(inputLen, 1), 10);
  const lengthScore = Math.min(lengthRatio * 20, 100);

  // Word diversity
  const words = output.toLowerCase().split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words);
  const diversityRatio = words.length > 0 ? uniqueWords.size / words.length : 0;
  const diversityScore = diversityRatio * 100;

  // Sentence structure
  const sentences = output.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLen =
    sentences.length > 0
      ? sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) /
        sentences.length
      : 0;
  const structureScore = Math.min(avgSentenceLen * 5, 100);

  // Keyword overlap
  const inputWords = new Set(
    input.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
  );
  const overlapCount = words.filter((w) => inputWords.has(w)).length;
  const relevanceScore = Math.min(
    (overlapCount / Math.max(inputWords.size, 1)) * 100,
    100
  );

  const relevance = Math.round(Math.min(Math.max(relevanceScore * 0.6 + lengthScore * 0.4, 10), 95));
  const coherence = Math.round(Math.min(Math.max(structureScore * 0.5 + diversityScore * 0.5, 10), 95));
  const accuracy = Math.round(Math.min(Math.max(lengthScore * 0.4 + diversityScore * 0.6, 10), 95));
  const creativity = Math.round(Math.min(Math.max(diversityScore * 0.7 + structureScore * 0.3, 10), 95));

  const overall = Math.round(
    relevance * DEFAULT_CRITERIA.relevance.weight +
      coherence * DEFAULT_CRITERIA.coherence.weight +
      accuracy * DEFAULT_CRITERIA.accuracy.weight +
      creativity * DEFAULT_CRITERIA.creativity.weight
  );

  return {
    relevance,
    coherence,
    accuracy,
    creativity,
    overall,
    feedback: generateFeedback(relevance, coherence, accuracy, creativity),
  };
}

function generateFeedback(
  relevance: number,
  coherence: number,
  accuracy: number,
  creativity: number
): string {
  const parts: string[] = [];

  if (relevance >= 70) parts.push("Output is well-aligned with the input prompt.");
  else parts.push("Consider refining the prompt for better relevance.");

  if (coherence >= 70) parts.push("Response is well-structured.");
  else parts.push("The response could benefit from better organization.");

  if (accuracy >= 70) parts.push("Good precision in the output.");
  else parts.push("Accuracy could be improved with more specific instructions.");

  if (creativity >= 70) parts.push("Shows good creative expression.");
  else parts.push("Adding examples or context may improve creativity.");

  return parts.join(" ");
}

export function compareEvaluations(
  evals: { modelId: string; evaluation: Omit<Evaluation, "id" | "runId" | "createdAt"> }[]
) {
  return evals
    .sort((a, b) => b.evaluation.overall - a.evaluation.overall)
    .map((e, idx) => ({
      ...e,
      rank: idx + 1,
    }));
}
