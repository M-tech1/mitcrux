import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

/* ── Section tag pill ────────────────────────────────────────────────────── */
export function SectionTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("tag-pill", className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-slow inline-block" />
      {children}
    </span>
  );
}

/* ── Ambient glow orbs ───────────────────────────────────────────────────── */
export function GlowOrb({
  color = "brand",
  size = "lg",
  className,
}: {
  color?: "brand" | "cyan" | "purple";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const colors = {
    brand:  "bg-brand-600",
    cyan:   "bg-cyan-500",
    purple: "bg-purple-600",
  };
  const sizes = {
    sm:  "w-48 h-48",
    md:  "w-72 h-72",
    lg:  "w-96 h-96",
    xl:  "w-[36rem] h-[36rem]",
  };

  return (
    <div
      className={cn(
        "glow-orb opacity-[0.12]",
        colors[color],
        sizes[size],
        className
      )}
      aria-hidden="true"
    />
  );
}

/* ── Dot grid background ─────────────────────────────────────────────────── */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn("absolute inset-0 bg-grid-dark", className)}
      aria-hidden="true"
    />
  );
}

/* ── Horizontal rule with gradient ──────────────────────────────────────── */
export function GradientDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent",
        className
      )}
      aria-hidden="true"
    />
  );
}

/* ── Service icon wrapper ─────────────────────────────────────────────────── */
export function ServiceIcon({
  icon: Icon,
  accent = "#1a72d7",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  accent?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "w-9 h-9", md: "w-12 h-12", lg: "w-16 h-16" };
  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };

  return (
    <div
      className={cn(
        "relative rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300",
        sizes[size],
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${accent}22, ${accent}44)`,
        border: `1px solid ${accent}33`,
      }}
    >
      <Icon className={iconSizes[size]} style={{ color: accent }} strokeWidth={1.8} />
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
        style={{ background: `${accent}22` }}
      />
    </div>
  );
}

/* ── Animated number stat ────────────────────────────────────────────────── */
export function StatBadge({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="stat-number text-3xl md:text-4xl leading-none">{value}</span>
      <span className="text-slate-500 text-xs font-mono tracking-wider uppercase">{label}</span>
    </div>
  );
}

/* ── Card container ──────────────────────────────────────────────────────── */
export function Card({
  children,
  className,
  glow = false,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl transition-all duration-300",
        "bg-surface-800 border border-white/5",
        hover && "hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-brand-md",
        glow && "card-glow",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "brand";
  className?: string;
}) {
  const variants = {
    default: "bg-white/5 text-slate-400 border-white/10",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    brand:   "bg-brand-500/10 text-brand-300 border-brand-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
