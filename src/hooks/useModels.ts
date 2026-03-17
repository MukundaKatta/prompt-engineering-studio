"use client";

import { useState, useEffect } from "react";
import { AIModel } from "@/types";
import { MODELS } from "@/lib/ai-providers";

export function useModels() {
  const [models] = useState<AIModel[]>(MODELS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/models");
      if (res.ok) {
        // Models endpoint returns available models based on configured keys
        await res.json();
      }
    } catch {
      // Fall back to static list
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const getModelsByProvider = (provider: string) =>
    models.filter((m) => m.provider === provider);

  return { models, isLoading, getModelsByProvider, refetch: fetchModels };
}
