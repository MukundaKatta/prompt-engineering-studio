"use client";

import { GitCommit, ChevronRight } from "lucide-react";
import { PromptVersion } from "@/types";
import { formatDate, cn } from "@/lib/utils";

interface VersionTimelineProps {
  versions: PromptVersion[];
  selectedId?: string;
  onSelect: (version: PromptVersion) => void;
}

export default function VersionTimeline({
  versions,
  selectedId,
  onSelect,
}: VersionTimelineProps) {
  if (versions.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-gray-700 bg-gray-800">
        <p className="text-sm text-gray-500">No versions yet. Save your prompt to create a version.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800">
      <div className="border-b border-gray-700 px-4 py-3">
        <h3 className="text-sm font-medium text-white">Version History</h3>
        <p className="text-xs text-gray-500">{versions.length} versions</p>
      </div>

      <div className="divide-y divide-gray-700">
        {versions.map((version, idx) => (
          <button
            key={version.id}
            onClick={() => onSelect(version)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-750",
              selectedId === version.id && "bg-indigo-500/10"
            )}
          >
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  idx === 0
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-gray-700 text-gray-500"
                )}
              >
                <GitCommit className="h-4 w-4" />
              </div>
              {idx < versions.length - 1 && (
                <div className="absolute top-8 h-full w-px bg-gray-700" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm text-white">
                {version.message || `Version ${version.version}`}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(version.createdAt)}
              </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-gray-600" />
          </button>
        ))}
      </div>
    </div>
  );
}
