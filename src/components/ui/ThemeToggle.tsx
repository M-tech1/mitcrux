"use client";

import { useTheme } from "@/components/ui/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "relative w-9 h-9 rounded-xl flex items-center justify-center",
        "border transition-all duration-300",
        "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white",
        "border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800",
        "shadow-sm",
        className
      )}
    >
      {/* Sun — shown in dark mode (click to go light) */}
      <Sun
        className={cn(
          "w-4 h-4 absolute transition-all duration-300",
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-50"
        )}
      />
      {/* Moon — shown in light mode (click to go dark) */}
      <Moon
        className={cn(
          "w-4 h-4 absolute transition-all duration-300",
          theme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-50"
        )}
      />
    </button>
  );
}
