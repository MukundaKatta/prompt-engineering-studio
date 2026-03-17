"use client";

import { Star, Download, Tag } from "lucide-react";
import { Template } from "@/types";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
  onUse: (template: Template) => void;
}

export default function TemplateCard({ template, onUse }: TemplateCardProps) {
  const categoryColors: Record<string, string> = {
    "Code Generation": "bg-blue-500/20 text-blue-400",
    Writing: "bg-green-500/20 text-green-400",
    Analysis: "bg-purple-500/20 text-purple-400",
    "Chat & Conversation": "bg-orange-500/20 text-orange-400",
    Data: "bg-cyan-500/20 text-cyan-400",
    Creative: "bg-pink-500/20 text-pink-400",
  };

  return (
    <div className="group flex flex-col rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-indigo-500/50">
      <div className="mb-2 flex items-start justify-between">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            categoryColors[template.category] || "bg-gray-700 text-gray-400"
          )}
        >
          {template.category}
        </span>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span className="text-xs text-gray-400">{template.rating.toFixed(1)}</span>
        </div>
      </div>

      <h3 className="mb-1 text-sm font-semibold text-white">{template.title}</h3>
      <p className="mb-3 flex-1 text-xs leading-relaxed text-gray-400">
        {template.description}
      </p>

      <div className="mb-3 flex flex-wrap gap-1">
        {template.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-400"
          >
            <Tag className="h-2.5 w-2.5" />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Download className="h-3 w-3" />
          <span>{template.usageCount} uses</span>
        </div>
        <button
          onClick={() => onUse(template)}
          className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
        >
          Use Template
        </button>
      </div>
    </div>
  );
}
