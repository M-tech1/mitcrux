"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, X } from "lucide-react";
import type { Timestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  addDays,
  startOfToday,
  type BusinessStatus,
  type Priority,
  type ProjectStatus,
  type TaskStatus,
} from "@/lib/operations";

/* ── Semantic colours (separate from the brand accent) ─────────────────── */

const STATUS_TONE: Record<BusinessStatus | ProjectStatus | TaskStatus, string> = {
  onboarding:  "bg-sky-400/10 text-sky-300 border-sky-400/30",
  planning:    "bg-sky-400/10 text-sky-300 border-sky-400/30",
  todo:        "bg-slate-400/10 text-slate-200 border-slate-400/30",
  active:      "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  in_progress: "bg-blue-400/10 text-blue-300 border-blue-400/30",
  on_hold:     "bg-amber-400/10 text-amber-300 border-amber-400/30",
  blocked:     "bg-red-400/10 text-red-300 border-red-400/30",
  completed:   "bg-teal-400/10 text-teal-300 border-teal-400/30",
  cancelled:   "bg-slate-500/10 text-slate-400 border-slate-500/30",
  archived:    "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const PRIORITY_TONE: Record<Priority, string> = {
  low:    "text-slate-300",
  medium: "text-sky-300",
  high:   "text-amber-300",
  urgent: "text-red-300",
};

const PRIORITY_BARS: Record<Priority, number> = { low: 1, medium: 2, high: 3, urgent: 4 };

export function StatusPill({ status, className }: { status: BusinessStatus | ProjectStatus | TaskStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap", STATUS_TONE[status], className)}>
      {STATUS_LABELS[status]}
    </span>
  );
}

/** Priority shown as a 4-step signal plus its name, so it never relies on colour alone */
export function PriorityPill({ priority }: { priority: Priority }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap", PRIORITY_TONE[priority])}>
      <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("w-[3px] rounded-sm", i <= PRIORITY_BARS[priority] ? "bg-current" : "bg-white/15")} style={{ height: `${i * 25}%` }} />
        ))}
      </span>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

export function ProgressBar({ value, late, label }: { value: number; late?: boolean; label?: string }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div
        className="h-1.5 flex-1 min-w-[4rem] rounded-full bg-white/10 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={label ?? "Progress"}
      >
        <div
          className={cn("h-full rounded-full", late ? "bg-gradient-to-r from-amber-400 to-red-400" : "bg-gradient-to-r from-brand-500 to-cyan-300")}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs tabular-nums w-9 text-right" style={{ color: "var(--text-secondary)" }}>{value}%</span>
    </div>
  );
}

/* ── Dates ─────────────────────────────────────────────────────────────── */

export function formatDate(ts: Timestamp | null | undefined, withYear = true) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
}

export function formatRelative(ts: Timestamp | null | undefined) {
  if (!ts) return "Just now";
  const mins = Math.round((Date.now() - ts.toDate().getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(ts);
}

/** Due date with overdue / due-soon emphasis (text + colour) */
export function DueLabel({ due, open }: { due: Timestamp | null; open: boolean }) {
  if (!due) return <span className="text-xs" style={{ color: "var(--text-muted)" }}>No due date</span>;
  const d = due.toDate();
  const today = startOfToday();
  const days = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (open && d < today) {
    return <span className="text-xs font-semibold text-red-300">Overdue · {formatDate(due, false)}</span>;
  }
  if (open && d < addDays(today, 7)) {
    return (
      <span className="text-xs font-semibold text-amber-300">
        {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `Due in ${days} days`}
      </span>
    );
  }
  return <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Due {formatDate(due)}</span>;
}

/* ── Layout pieces ─────────────────────────────────────────────────────── */

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div className="min-w-0">
        <h1 className="font-h1 text-3xl md:text-4xl tracking-tight">{title}</h1>
        {description && <p className="text-sm mt-1.5 max-w-2xl" style={{ color: "var(--text-secondary)" }}>{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Section({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card-surface p-5 md:p-6", className)}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-accent)" }}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>{children}</p>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-8 px-4 text-center">
      <AlertCircle className="w-7 h-7 text-red-400" aria-hidden="true" />
      <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-ghost !py-2 !min-h-0 !text-sm">
          Try again
        </button>
      )}
    </div>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-white/[0.04] animate-pulse" />
      ))}
    </div>
  );
}

export function StatTile({ label, value, tone, href }: { label: string; value: number | null; tone?: "danger" | "warning"; href?: string }) {
  const body = (
    <>
      <span
        className={cn(
          "block font-display font-extrabold text-2xl tabular-nums",
          tone === "danger" && value ? "text-red-300" : tone === "warning" && value ? "text-amber-300" : "",
        )}
      >
        {value ?? "–"}
      </span>
      <span className="block text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{label}</span>
    </>
  );
  const cls = "card-surface p-4 block transition-colors";
  return href ? (
    <Link href={href} className={cn(cls, "hover:!border-white/15 hover:!bg-[var(--bg-card-hover)]")}>{body}</Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/* ── Form controls ─────────────────────────────────────────────────────── */

export function Field({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? <span className="text-cyan-300 ml-0.5" aria-hidden="true">*</span> : <span className="ml-1.5 text-xs font-normal" style={{ color: "var(--text-muted)" }}>optional</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>}
      {error && <p id={`${id}-error`} className="text-xs text-red-300">{error}</p>}
    </div>
  );
}

export function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label htmlFor={id} className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field !min-h-[40px] !py-2 cursor-pointer">
        {children}
      </select>
    </div>
  );
}

/* ── Modal (Radix Dialog: focus trap, Esc to close, labelled) ──────────── */

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-[#020817]/70 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "force-dark fixed z-[111] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto",
            "rounded-2xl border border-[var(--glass-border)] bg-[#0c1a36] p-6 sm:p-7 shadow-[0_24px_80px_rgba(2,8,23,0.6)] focus:outline-none",
            wide ? "max-w-3xl" : "max-w-xl",
          )}
          style={{ color: "var(--text-primary)" }}
          {...(description ? {} : { "aria-describedby": undefined })}
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <Dialog.Title className="font-h1 text-xl tracking-tight">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close className="w-9 h-9 -mr-2 -mt-1 rounded-lg flex items-center justify-center hover:bg-white/5 shrink-0" aria-label="Close">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
