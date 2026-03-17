"use client";

import { Plus, Trash2, Variable as VariableIcon } from "lucide-react";
import { Variable } from "@/types";

interface VariablePanelProps {
  variables: Variable[];
  onAdd: () => void;
  onUpdate: (index: number, variable: Variable) => void;
  onRemove: (index: number) => void;
}

export default function VariablePanel({
  variables,
  onAdd,
  onUpdate,
  onRemove,
}: VariablePanelProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VariableIcon className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-medium text-white">Variables</h3>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600 hover:text-white"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      {variables.length === 0 ? (
        <p className="py-4 text-center text-xs text-gray-500">
          No variables defined. Use {"{{variable_name}}"} in your prompt.
        </p>
      ) : (
        <div className="space-y-2">
          {variables.map((v, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <input
                type="text"
                value={v.key}
                onChange={(e) =>
                  onUpdate(idx, { ...v, key: e.target.value })
                }
                placeholder="key"
                className="h-8 w-28 rounded border border-gray-600 bg-gray-700 px-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={v.value}
                onChange={(e) =>
                  onUpdate(idx, { ...v, value: e.target.value })
                }
                placeholder="value"
                className="h-8 flex-1 rounded border border-gray-600 bg-gray-700 px-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={() => onRemove(idx)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-gray-500 hover:bg-gray-700 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
