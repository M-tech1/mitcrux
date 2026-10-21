"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  OPEN_TASK_STATUSES,
  describeError,
  isProjectLate,
  isTaskOverdue,
  projectProgress,
  setTaskStatus,
  type Activity,
  type Project,
  type Task,
} from "@/lib/operations";
import { DueLabel, PriorityPill, ProgressBar, StatusPill, formatRelative, EmptyState } from "@/components/admin/ops/ui";
import { TaskFormDialog } from "@/components/admin/ops/forms";
import { useToast } from "@/components/admin/ops/Toast";

/* ── Tasks ─────────────────────────────────────────────────────────────── */

export function TaskList({
  tasks,
  onChanged,
  showBusiness = true,
  showProject = true,
  empty = "No tasks.",
}: {
  tasks: Task[];
  onChanged: () => void;
  showBusiness?: boolean;
  showProject?: boolean;
  empty?: string;
}) {
  const toast = useToast();
  const [editing, setEditing] = useState<Task | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const toggleDone = async (t: Task) => {
    if (busyId) return;
    setBusyId(t.id);
    try {
      const next = t.status === "completed" ? "todo" : "completed";
      await setTaskStatus(t, next);
      toast(next === "completed" ? `Completed “${t.title}”` : `Reopened “${t.title}”`);
      onChanged();
    } catch (err) {
      toast(describeError(err), "error");
    } finally {
      setBusyId(null);
    }
  };

  if (!tasks.length) return <EmptyState>{empty}</EmptyState>;

  return (
    <>
      <ul className="divide-y divide-[var(--border-card)]">
        {tasks.map((t) => {
          const done = t.status === "completed";
          const open = OPEN_TASK_STATUSES.includes(t.status);
          const overdue = isTaskOverdue(t);
          return (
            <li key={t.id} className={cn("flex items-start gap-3 py-3", overdue && "relative")}>
              {overdue && <span className="absolute -left-3 md:-left-4 top-3 bottom-3 w-0.5 rounded-full bg-red-400/70" aria-hidden="true" />}
              <button
                type="button"
                onClick={() => toggleDone(t)}
                disabled={busyId === t.id || t.status === "cancelled"}
                aria-label={done ? `Reopen ${t.title}` : `Mark ${t.title} as completed`}
                aria-pressed={done}
                className={cn(
                  "mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors disabled:opacity-40",
                  done ? "bg-teal-400/80 border-teal-300 text-[#081329]" : "border-white/25 hover:border-cyan-300",
                )}
              >
                {busyId === t.id ? (
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  done && <Check className="w-3.5 h-3.5" strokeWidth={3} />
                )}
              </button>

              <button type="button" onClick={() => setEditing(t)} className="flex-1 min-w-0 text-left group rounded-lg">
                <span className={cn("block text-sm font-medium group-hover:text-cyan-300 transition-colors", done && "line-through opacity-60")}>
                  {t.title}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <StatusPill status={t.status} />
                  <PriorityPill priority={t.priority} />
                  <DueLabel due={t.dueDate} open={open} />
                  {(showBusiness || showProject) && (
                    <span className="text-xs truncate max-w-full" style={{ color: "var(--text-muted)" }}>
                      {[showBusiness ? t.businessName : "", showProject ? t.projectName : ""].filter(Boolean).join(" · ")}
                    </span>
                  )}
                  {t.assignee && <span className="text-xs" style={{ color: "var(--text-muted)" }}>→ {t.assignee}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <TaskFormDialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)} task={editing} onSaved={onChanged} />
    </>
  );
}

/* ── Projects ──────────────────────────────────────────────────────────── */

export function ProjectList({ projects, showBusiness = true, empty = "No projects." }: { projects: Project[]; showBusiness?: boolean; empty?: string }) {
  if (!projects.length) return <EmptyState>{empty}</EmptyState>;
  return (
    <ul className="divide-y divide-[var(--border-card)]">
      {projects.map((p) => {
        const late = isProjectLate(p);
        return (
          <li key={p.id}>
            <Link href={`/admin/operations/projects/${p.id}`} className="group grid sm:grid-cols-[1fr_11rem_auto] items-center gap-x-5 gap-y-2 py-3.5 rounded-lg">
              <span className="min-w-0">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold truncate group-hover:text-cyan-300 transition-colors">{p.name}</span>
                  {p.code && <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-muted)" }}>{p.code}</span>}
                  {p.archived && <Archive className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} aria-label="Archived" />}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <StatusPill status={p.status} />
                  <PriorityPill priority={p.priority} />
                  <DueLabel due={p.dueDate} open={!p.archived && ["planning", "active", "on_hold"].includes(p.status)} />
                  {showBusiness && <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{p.businessName}</span>}
                </span>
              </span>
              <span>
                <ProgressBar value={projectProgress(p)} late={late} label={`${p.name} progress`} />
                <span className="block text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {p.taskDone}/{p.taskTotal} tasks done
                </span>
              </span>
              <ChevronRight className="hidden sm:block w-4 h-4" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Activity ──────────────────────────────────────────────────────────── */

export function ActivityList({ items, empty = "No activity yet." }: { items: Activity[]; empty?: string }) {
  if (!items.length) return <EmptyState>{empty}</EmptyState>;
  const dot = { business: "bg-sky-300", project: "bg-brand-400", task: "bg-cyan-300" } as const;
  return (
    <ol className="space-y-3">
      {items.map((a) => (
        <li key={a.id} className="flex items-start gap-3">
          <span className={cn("mt-1.5 w-2 h-2 rounded-full shrink-0", dot[a.kind])} aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <Link
              href={a.kind === "business" ? `/admin/operations/businesses/${a.businessId}` : a.projectId ? `/admin/operations/projects/${a.projectId}` : `/admin/operations/businesses/${a.businessId}`}
              className="block text-sm hover:text-cyan-300 transition-colors"
            >
              {a.message}
            </Link>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatRelative(a.at)}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Load-more control for paginated lists */
export function LoadMore({ hasMore, loading, onClick }: { hasMore: boolean; loading: boolean; onClick: () => void }) {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center pt-4">
      <button type="button" onClick={onClick} disabled={loading} className="btn-ghost !py-2 !min-h-0 !text-sm disabled:opacity-60">
        {loading ? "Loading…" : "Load more"}
      </button>
    </div>
  );
}
