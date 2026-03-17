"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  GitCompare,
  History,
  LayoutGrid,
  Settings,
  Sparkles,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/editor", label: "Editor", icon: Code2 },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/history", label: "History", icon: History },
  { href: "/templates", label: "Templates", icon: LayoutGrid },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-gray-700 bg-gray-900">
      <div className="flex h-14 items-center gap-2 border-b border-gray-700 px-4">
        <Sparkles className="h-6 w-6 text-indigo-500" />
        <span className="text-lg font-bold text-white">PromptStudio</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <div className="rounded-lg bg-gray-800 p-3">
          <p className="text-xs text-gray-400">Keyboard Shortcuts</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Run prompt</span>
              <kbd className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-300">
                Cmd+Enter
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Save</span>
              <kbd className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-300">
                Cmd+S
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
