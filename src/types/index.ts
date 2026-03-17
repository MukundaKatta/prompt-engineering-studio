export type AIProvider = "anthropic" | "openai" | "gemini";

export type ModelId =
  | "claude-sonnet-4-20250514"
  | "claude-haiku-3.5"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gemini-1.5-pro"
  | "gemini-1.5-flash";

export interface AIModel {
  id: ModelId;
  name: string;
  provider: AIProvider;
  maxTokens: number;
  inputPricePerMToken: number;
  outputPricePerMToken: number;
}

export interface Variable {
  key: string;
  value: string;
  description?: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  systemPrompt: string;
  variables: Variable[];
  modelId: ModelId;
  temperature: number;
  maxTokens: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  content: string;
  systemPrompt: string;
  variables: Variable[];
  diff?: string;
  createdAt: string;
  message?: string;
}

export interface RunResult {
  id: string;
  promptId?: string;
  modelId: ModelId;
  input: string;
  systemPrompt: string;
  output: string;
  variables: Variable[];
  temperature: number;
  maxTokens: number;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  cost: number;
  createdAt: string;
}

export interface Evaluation {
  id: string;
  runId: string;
  relevance: number;
  coherence: number;
  accuracy: number;
  creativity: number;
  overall: number;
  feedback: string;
  createdAt: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  systemPrompt: string;
  variables: Variable[];
  author: string;
  usageCount: number;
  rating: number;
  tags: string[];
  createdAt: string;
}

export interface ComparisonItem {
  modelId: ModelId;
  result?: RunResult;
  evaluation?: Evaluation;
  isLoading: boolean;
  error?: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export interface ApiKeyConfig {
  anthropic: string;
  openai: string;
  gemini: string;
}
