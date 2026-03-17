"use client";

import { useState } from "react";
import Header from "@/components/Header";
import VersionTimeline from "@/components/VersionTimeline";
import DiffViewer from "@/components/DiffViewer";
import { PromptVersion } from "@/types";
import { computeDiff } from "@/lib/diff";

// Demo data for UI display
const DEMO_VERSIONS: PromptVersion[] = [
  {
    id: "v3",
    promptId: "p1",
    version: 3,
    content:
      "You are an expert {{role}}. Analyze the following {{topic}} and provide:\n1. Key insights\n2. Actionable recommendations\n3. Potential risks\n\nBe concise, use bullet points, and cite sources when possible.",
    systemPrompt: "You are a senior analyst with deep expertise.",
    variables: [
      { key: "role", value: "data analyst" },
      { key: "topic", value: "market trends" },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    message: "Added citation requirement and risk analysis",
  },
  {
    id: "v2",
    promptId: "p1",
    version: 2,
    content:
      "You are an expert {{role}}. Analyze the following {{topic}} and provide:\n1. Key insights\n2. Actionable recommendations\n\nBe concise and use bullet points.",
    systemPrompt: "You are a senior analyst with deep expertise.",
    variables: [
      { key: "role", value: "data analyst" },
      { key: "topic", value: "market trends" },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    message: "Added structured output format",
  },
  {
    id: "v1",
    promptId: "p1",
    version: 1,
    content:
      "You are an expert {{role}}. Analyze the following {{topic}} and provide insights and recommendations.",
    systemPrompt: "You are a helpful assistant.",
    variables: [
      { key: "role", value: "analyst" },
      { key: "topic", value: "trends" },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    message: "Initial prompt version",
  },
];

export default function HistoryPage() {
  const [versions] = useState<PromptVersion[]>(DEMO_VERSIONS);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(
    null
  );

  const selectedIdx = selectedVersion
    ? versions.findIndex((v) => v.id === selectedVersion.id)
    : -1;
  const previousVersion =
    selectedIdx >= 0 && selectedIdx < versions.length - 1
      ? versions[selectedIdx + 1]
      : null;

  const diff =
    selectedVersion && previousVersion
      ? computeDiff(previousVersion.content, selectedVersion.content)
      : [];

  return (
    <div className="flex flex-col">
      <Header
        title="Version History"
        subtitle="Track prompt changes over time"
      />

      <div className="flex flex-1 p-6">
        {/* Timeline */}
        <div className="w-80 shrink-0 pr-6">
          <VersionTimeline
            versions={versions}
            selectedId={selectedVersion?.id}
            onSelect={setSelectedVersion}
          />
        </div>

        {/* Detail */}
        <div className="flex-1 space-y-4">
          {selectedVersion ? (
            <>
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">
                    Version {selectedVersion.version}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(selectedVersion.createdAt).toLocaleString()}
                  </span>
                </div>
                {selectedVersion.message && (
                  <p className="mb-3 text-sm text-gray-400">
                    {selectedVersion.message}
                  </p>
                )}
                <pre className="whitespace-pre-wrap rounded-lg bg-gray-900 p-4 text-sm text-gray-300">
                  {selectedVersion.content}
                </pre>
              </div>

              {previousVersion && (
                <DiffViewer
                  diff={diff}
                  title={`Changes from v${previousVersion.version} to v${selectedVersion.version}`}
                />
              )}

              {selectedVersion.variables.length > 0 && (
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                  <h4 className="mb-2 text-sm font-medium text-white">
                    Variables
                  </h4>
                  <div className="space-y-1">
                    {selectedVersion.variables.map((v) => (
                      <div
                        key={v.key}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="rounded bg-gray-700 px-2 py-0.5 text-xs font-mono text-indigo-300">
                          {`{{${v.key}}}`}
                        </span>
                        <span className="text-gray-400">= {v.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800">
              <p className="text-sm text-gray-500">
                Select a version to view details and diffs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
