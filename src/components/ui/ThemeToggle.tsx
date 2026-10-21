"use client";

import { useTheme } from "@/components/ui/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "relative w-10 h-10 rounded-xl flex items-center justify-center",
        "border transition-colors duration-300",
        "border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--border-hover)]",
        "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
        className
      )}
    >
      {/* Icons are driven by the <html> class so they are correct on first paint */}
      {/* Sun — shown in dark mode (click to go light) */}
      <Sun
        aria-hidden="true"
        className="w-4 h-4 absolute transition-all duration-300 opacity-0 -rotate-90 scale-50 dark:opacity-100 dark:rotate-0 dark:scale-100"
      />
      {/* Moon — shown in light mode (click to go dark) */}
      <Moon
        aria-hidden="true"
        className="w-4 h-4 absolute transition-all duration-300 opacity-100 rotate-0 scale-100 dark:opacity-0 dark:rotate-90 dark:scale-50"
      />
    </button>
  );
}
