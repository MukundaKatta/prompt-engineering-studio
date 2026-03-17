"use client";

import { cn } from "@/lib/utils";

interface MetricsCardProps {
  label: string;
  value: number;
  maxValue?: number;
  suffix?: string;
  size?: "sm" | "md";
}

export default function MetricsCard({
  label,
  value,
  maxValue = 100,
  suffix = "",
  size = "md",
}: MetricsCardProps) {
  const percentage = (value / maxValue) * 100;

  const getColor = (pct: number) => {
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-yellow-500";
    if (pct >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-700 bg-gray-800 p-3",
        size === "sm" && "p-2"
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className={cn("text-gray-400", size === "sm" ? "text-xs" : "text-sm")}>
          {label}
        </span>
        <span className={cn("font-semibold text-white", size === "sm" ? "text-sm" : "text-lg")}>
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-700">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColor(percentage))}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
