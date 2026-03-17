"use client";

import { DiffLine } from "@/lib/diff";
import { cn } from "@/lib/utils";

interface DiffViewerProps {
  diff: DiffLine[];
  title?: string;
}

export default function DiffViewer({ diff, title }: DiffViewerProps) {
  if (diff.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-gray-700 bg-gray-800">
        <p className="text-sm text-gray-500">No changes to display.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 overflow-hidden">
      {title && (
        <div className="border-b border-gray-700 px-4 py-2">
          <h4 className="text-sm font-medium text-white">{title}</h4>
        </div>
      )}
      <div className="overflow-auto">
        <table className="w-full">
          <tbody>
            {diff.map((line, idx) => (
              <tr
                key={idx}
                className={cn(
                  line.type === "added" && "bg-green-500/10",
                  line.type === "removed" && "bg-red-500/10"
                )}
              >
                <td className="w-12 select-none border-r border-gray-700 px-2 py-0.5 text-right text-xs text-gray-600">
                  {line.lineNumber}
                </td>
                <td className="w-6 select-none px-1 py-0.5 text-center text-xs">
                  {line.type === "added" && (
                    <span className="text-green-400">+</span>
                  )}
                  {line.type === "removed" && (
                    <span className="text-red-400">-</span>
                  )}
                </td>
                <td className="px-2 py-0.5">
                  <code
                    className={cn(
                      "text-xs",
                      line.type === "added" && "text-green-300",
                      line.type === "removed" && "text-red-300",
                      line.type === "unchanged" && "text-gray-400"
                    )}
                  >
                    {line.content}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
