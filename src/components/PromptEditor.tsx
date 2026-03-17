"use client";

import { useCallback, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  language?: string;
  placeholder?: string;
  height?: string;
}

export default function PromptEditor({
  value,
  onChange,
  onRun,
  language = "markdown",
  placeholder = "Write your prompt here...\n\nUse {{variable_name}} for template variables.",
  height = "400px",
}: PromptEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Cmd+Enter to run
      editor.addAction({
        id: "run-prompt",
        label: "Run Prompt",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        run: () => {
          onRun?.();
        },
      });

      // Focus editor
      editor.focus();
    },
    [onRun]
  );

  const handleChange = useCallback(
    (val: string | undefined) => {
      onChange(val || "");
    },
    [onChange]
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700">
      <Editor
        height={height}
        language={language}
        theme="vs-dark"
        value={value || placeholder}
        onChange={handleChange}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          padding: { top: 16, bottom: 16 },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          renderWhitespace: "none",
          bracketPairColorization: { enabled: true },
          suggest: { showWords: false },
          quickSuggestions: false,
          folding: false,
          lineNumbers: "on",
          glyphMargin: false,
          lineDecorationsWidth: 8,
        }}
      />
    </div>
  );
}
