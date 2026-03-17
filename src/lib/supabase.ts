import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function savePrompt(prompt: {
  title: string;
  content: string;
  system_prompt: string;
  variables: Record<string, string>[];
  model_id: string;
  temperature: number;
  max_tokens: number;
}) {
  const { data, error } = await supabase
    .from("prompts")
    .insert(prompt)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getPrompts() {
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveRun(run: {
  prompt_id?: string;
  model_id: string;
  input: string;
  system_prompt: string;
  output: string;
  variables: Record<string, string>[];
  temperature: number;
  max_tokens: number;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  cost: number;
}) {
  const { data, error } = await supabase
    .from("runs")
    .insert(run)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRuns(promptId?: string) {
  let query = supabase.from("runs").select("*").order("created_at", { ascending: false });
  if (promptId) {
    query = query.eq("prompt_id", promptId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function saveVersion(version: {
  prompt_id: string;
  version: number;
  content: string;
  system_prompt: string;
  variables: Record<string, string>[];
  diff?: string;
  message?: string;
}) {
  const { data, error } = await supabase
    .from("prompt_versions")
    .insert(version)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getVersions(promptId: string) {
  const { data, error } = await supabase
    .from("prompt_versions")
    .select("*")
    .eq("prompt_id", promptId)
    .order("version", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTemplates() {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("usage_count", { ascending: false });
  if (error) throw error;
  return data;
}
