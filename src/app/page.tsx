"use client";

import Header from "@/components/Header";
import {
  Code2,
  GitCompare,
  History,
  LayoutGrid,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Prompts Created", value: "0", icon: Code2, change: "Start building" },
  { label: "Model Runs", value: "0", icon: Zap, change: "Run your first prompt" },
  { label: "Avg Latency", value: "--", icon: Clock, change: "No data yet" },
  { label: "Total Spend", value: "$0.00", icon: DollarSign, change: "No costs yet" },
];

const quickActions = [
  {
    title: "Prompt Editor",
    description: "Write, test, and iterate on prompts with Monaco editor",
    href: "/editor",
    icon: Code2,
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "Model Comparison",
    description: "Run prompts across 2-4 models side by side",
    href: "/compare",
    icon: GitCompare,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Version History",
    description: "Track prompt changes with timeline and diffs",
    href: "/history",
    icon: History,
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Template Marketplace",
    description: "Browse and use community prompt templates",
    href: "/templates",
    icon: LayoutGrid,
    color: "from-blue-500 to-cyan-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Dashboard" subtitle="Prompt Engineering Studio" />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-gray-700 bg-gray-800 p-4"
            >
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-gray-500" />
                <TrendingUp className="h-4 w-4 text-gray-600" />
              </div>
              <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="mt-1 text-xs text-gray-600">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-start gap-4 rounded-lg border border-gray-700 bg-gray-800 p-5 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${action.color}`}
              >
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-indigo-400">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 className="mb-4 mt-8 text-lg font-semibold text-white">
          Recent Activity
        </h2>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Zap className="mb-3 h-10 w-10 text-gray-600" />
            <p className="text-sm text-gray-400">No recent activity</p>
            <p className="mt-1 text-xs text-gray-600">
              Start by creating a prompt in the editor
            </p>
            <Link
              href="/editor"
              className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
