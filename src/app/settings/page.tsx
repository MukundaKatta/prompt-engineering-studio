"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { showToast } from "@/components/Toast";
import { Key, Eye, EyeOff, Check, ExternalLink } from "lucide-react";
import { getApiKeyFromStorage, setApiKeyToStorage, cn } from "@/lib/utils";

interface ApiKeyField {
  provider: string;
  label: string;
  placeholder: string;
  docsUrl: string;
  color: string;
}

const API_KEYS: ApiKeyField[] = [
  {
    provider: "anthropic",
    label: "Anthropic API Key",
    placeholder: "sk-ant-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
    color: "text-orange-400",
  },
  {
    provider: "openai",
    label: "OpenAI API Key",
    placeholder: "sk-...",
    docsUrl: "https://platform.openai.com/api-keys",
    color: "text-green-400",
  },
  {
    provider: "gemini",
    label: "Google Gemini API Key",
    placeholder: "AI...",
    docsUrl: "https://aistudio.google.com/app/apikey",
    color: "text-blue-400",
  },
];

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loaded: Record<string, string> = {};
    for (const field of API_KEYS) {
      loaded[field.provider] = getApiKeyFromStorage(field.provider);
    }
    setKeys(loaded);
  }, []);

  const handleSave = (provider: string) => {
    setApiKeyToStorage(provider, keys[provider] || "");
    showToast("success", `${provider} API key saved`);
  };

  const toggleVisibility = (provider: string) => {
    setVisibility((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <div className="flex flex-col">
      <Header title="Settings" subtitle="Configure API keys and preferences" />

      <div className="mx-auto w-full max-w-2xl p-6">
        {/* API Keys */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Key className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">API Keys</h2>
          </div>
          <p className="mb-6 text-sm text-gray-400">
            API keys are stored locally in your browser and never sent to our
            servers. They are passed directly to the AI provider APIs.
          </p>

          <div className="space-y-4">
            {API_KEYS.map((field) => (
              <div
                key={field.provider}
                className="rounded-lg border border-gray-700 bg-gray-800 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <label className={cn("text-sm font-medium", field.color)}>
                    {field.label}
                  </label>
                  <a
                    href={field.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-400"
                  >
                    Get key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={visibility[field.provider] ? "text" : "password"}
                      value={keys[field.provider] || ""}
                      onChange={(e) =>
                        setKeys((prev) => ({
                          ...prev,
                          [field.provider]: e.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      className="h-9 w-full rounded-md border border-gray-600 bg-gray-700 px-3 pr-8 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      onClick={() => toggleVisibility(field.provider)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {visibility[field.provider] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => handleSave(field.provider)}
                    className="flex h-9 items-center gap-1 rounded-md bg-indigo-500 px-3 text-sm text-white hover:bg-indigo-600"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Save
                  </button>
                </div>
                {keys[field.provider] && (
                  <p className="mt-1 text-xs text-green-500">Key configured</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-4">
              <div>
                <p className="text-sm font-medium text-white">Default Model</p>
                <p className="text-xs text-gray-500">
                  Model used when creating new prompts
                </p>
              </div>
              <select className="h-8 rounded-md border border-gray-600 bg-gray-700 px-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
                <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Auto-evaluate Outputs
                </p>
                <p className="text-xs text-gray-500">
                  Automatically score outputs after each run
                </p>
              </div>
              <button className="h-6 w-10 rounded-full bg-indigo-500 p-0.5 transition-colors">
                <div className="h-5 w-5 translate-x-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Save Run History
                </p>
                <p className="text-xs text-gray-500">
                  Store all prompt runs for later analysis
                </p>
              </div>
              <button className="h-6 w-10 rounded-full bg-indigo-500 p-0.5 transition-colors">
                <div className="h-5 w-5 translate-x-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
