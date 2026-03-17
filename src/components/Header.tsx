"use client";

import { Bell, Search, User } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-700 bg-gray-900 px-6">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && (
          <p className="text-xs text-gray-400">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search prompts..."
            className="h-8 w-64 rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
          <Bell className="h-4 w-4" />
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-medium text-white">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
