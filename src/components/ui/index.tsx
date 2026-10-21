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
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(103,216,255,0.8)] inline-block" aria-hidden="true" />
      {children}
    </span>
  );
}

/* ── Section heading (eyebrow + title + optional accent line + intro) ──── */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "split",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  description?: React.ReactNode;
  align?: "split" | "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}) {
  const heading = (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center")}>
      {eyebrow && <SectionTag className="mb-5">{eyebrow}</SectionTag>}
      <Tag
        className={cn(
          Tag === "h1" ? "font-h1 text-h1" : "font-display font-extrabold text-h2"
        )}
        style={{ color: "var(--text-primary)" }}
      >
        {title}
        {accent && (
          <>
            <br />
            <span className="text-gradient">{accent}</span>
          </>
        )}
      </Tag>
      {description && align !== "split" && (
        <p
          className={cn("mt-6 text-lead font-normal max-w-2xl", align === "center" && "mx-auto")}
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>
      )}
    </div>
  );

  if (align !== "split") return <div className={className}>{heading}</div>;

  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12", className)}>
      <div className="flex-1">{heading}</div>
      {description && (
        <p
          className="md:max-w-sm text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ── Inner page header ───────────────────────────────────────────────────── */
export function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section
      className="relative pt-36 md:pt-44 pb-16 md:pb-20 overflow-hidden"
     
    >
      <div className="absolute inset-0 bg-ambient" aria-hidden="true" />
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <div className="anim-rise">
          <SectionHeading
            as="h1"
            align="center"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
            description={description}
          />
        </div>
        {children && (
          <div className="anim-rise" style={{ "--d": "150ms" } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
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

  // Glossy 3D tile: lit top-left, accent glow beneath, specular highlight on top
  return (
    <div
      className={cn(
        "relative rounded-2xl flex items-center justify-center shrink-0 group-hover:-translate-y-0.5 transition-transform duration-300",
        sizes[size],
        className
      )}
      style={{
        background: `linear-gradient(145deg, ${accent} 0%, ${accent}cc 45%, ${accent}66 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -6px 12px rgba(2,8,23,0.25), 0 8px 20px -6px ${accent}aa`,
      }}
    >
      <span
        className="absolute inset-x-1.5 top-1 h-1/2 rounded-t-xl bg-gradient-to-b from-white/35 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <Icon className={cn("relative text-[#ffffff] drop-shadow-sm", iconSizes[size])} strokeWidth={2} />
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
      <span className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{label}</span>
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
        "card-surface",
        hover && "card-interactive",
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
