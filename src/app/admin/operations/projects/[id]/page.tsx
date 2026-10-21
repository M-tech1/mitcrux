"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Archive, ArchiveRestore, ListPlus, CalendarDays, User, Hash, Layers } from "lucide-react";
import {
  OPEN_TASK_STATUSES,
  PROJECT_STATUSES,
  STATUS_LABELS,
  describeError,
  getProject,
  isProjectLate,
  listActivity,
  listTasks,
  projectProgress,
  setProjectArchived,
  setProjectStatus,
  type ProjectStatus,
} from "@/lib/operations";
import { useLoad } from "@/components/admin/ops/useLoad";
import { useToast } from "@/components/admin/ops/Toast";
import { DueLabel, ErrorState, LoadingRows, PriorityPill, ProgressBar, Section, StatusPill, formatDate } from "@/components/admin/ops/ui";
import { ActivityList, TaskList } from "@/components/admin/ops/lists";
import { ProjectFormDialog, TaskFormDialog } from "@/components/admin/ops/forms";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const toast = useToast();
  const [dialog, setDialog] = useState<"edit" | "task" | null>(null);
  const [busy, setBusy] = useState(false);

  const project = useLoad(() => getProject(id), [id]);
  const tasks = useLoad(async () => (await listTasks({ projectId: id, pageSize: 200 })).items, [id]);
  const activity = useLoad(() => listActivity({ projectId: id, limit: 20 }), [id]);

  const reloadAll = () => {
    project.reload();
    tasks.reload();
    activity.reload();
  };

  const p = project.data;

  const run = async (action: () => Promise<void>, success: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await action();
      toast(success);
      reloadAll();
    } catch (err) {
      toast(describeError(err), "error");
    } finally {
      setBusy(false);
    }
  };

  if (project.loading && !p) return <LoadingRows rows={5} />;
  if (project.error) return <div className="card-surface"><ErrorState message={project.error} onRetry={project.reload} /></div>;
  if (!p) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>This project doesn&apos;t exist.</p>
        <Link href="/admin/operations/projects" className="btn-ghost !text-sm">Back to projects</Link>
      </div>
    );
  }

  const all = tasks.data ?? [];
  const open = all.filter((t) => OPEN_TASK_STATUSES.includes(t.status));
  const closed = all.filter((t) => !OPEN_TASK_STATUSES.includes(t.status));
  const late = isProjectLate(p);
  const live = !p.archived && ["planning", "active", "on_hold"].includes(p.status);

  return (
    <>
      <Link href="/admin/operations/projects" className="inline-flex items-center gap-1.5 text-sm mb-5 rounded-lg hover:text-[var(--text-primary)]" style={{ color: "var(--text-secondary)" }}>
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-h1 text-3xl md:text-4xl tracking-tight break-words">{p.name}</h1>
            <StatusPill status={p.status} />
            {p.archived && <StatusPill status="archived" />}
          </div>
          <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
            For{" "}
            <Link href={`/admin/operations/businesses/${p.businessId}`} className="text-cyan-300 hover:underline">{p.businessName}</Link>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="proj-status" className="sr-only">Project status</label>
          <select
            id="proj-status"
            value={p.status}
            disabled={busy}
            onChange={(e) => {
              const s = e.target.value as ProjectStatus;
              run(() => setProjectStatus(p, s), `Project moved to ${STATUS_LABELS[s]}`);
            }}
            className="field !w-auto !min-h-[40px] !py-2 cursor-pointer"
          >
            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button type="button" onClick={() => setDialog("edit")} className="btn-ghost !text-sm !py-2 !min-h-[40px]">
            <Pencil className="w-4 h-4" aria-hidden="true" /> Edit
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => setProjectArchived(p, !p.archived), p.archived ? "Project restored" : "Project archived. Its tasks are kept.")}
            className="btn-ghost !text-sm !py-2 !min-h-[40px]"
          >
            {p.archived ? <ArchiveRestore className="w-4 h-4" aria-hidden="true" /> : <Archive className="w-4 h-4" aria-hidden="true" />}
            {p.archived ? "Restore" : "Archive"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_22rem] gap-5 items-start">
        <div className="space-y-5 min-w-0">
          <Section title="Progress">
            <ProgressBar value={projectProgress(p)} late={late} label="Project progress" />
            <p className="text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
              {p.taskDone} of {p.taskTotal} tasks completed
              {late && <span className="text-red-300 font-semibold"> · Running late</span>}
            </p>
          </Section>

          <Section
            title={`Open tasks (${open.length})`}
            action={
              <button type="button" onClick={() => setDialog("task")} className="btn-ghost !text-sm !py-1.5 !min-h-0">
                <ListPlus className="w-4 h-4" aria-hidden="true" /> Add task
              </button>
            }
          >
            {tasks.error ? <ErrorState message={tasks.error} onRetry={tasks.reload} /> : tasks.loading && !tasks.data ? <LoadingRows rows={3} /> : (
              <TaskList tasks={open} onChanged={reloadAll} showBusiness={false} showProject={false} empty="No open tasks on this project." />
            )}
          </Section>

          {closed.length > 0 && (
            <Section title={`Completed and cancelled (${closed.length})`}>
              <TaskList tasks={closed} onChanged={reloadAll} showBusiness={false} showProject={false} />
            </Section>
          )}
        </div>

        <div className="space-y-5 min-w-0">
          <Section title="Details">
            <div className="space-y-3 text-sm">
              {p.code && <div className="flex items-start gap-3"><Hash className="w-4 h-4 mt-0.5 text-cyan-300" aria-hidden="true" /><div><p className="text-xs" style={{ color: "var(--text-muted)" }}>Reference</p><div className="font-mono">{p.code}</div></div></div>}
              {p.category && <div className="flex items-start gap-3"><Layers className="w-4 h-4 mt-0.5 text-cyan-300" aria-hidden="true" /><div><p className="text-xs" style={{ color: "var(--text-muted)" }}>Category</p><div>{p.category}</div></div></div>}
              <div className="flex items-start gap-3"><CalendarDays className="w-4 h-4 mt-0.5 text-cyan-300" aria-hidden="true" /><div><p className="text-xs" style={{ color: "var(--text-muted)" }}>Timeline</p><div>{formatDate(p.startDate)} → {formatDate(p.dueDate)}</div><div className="mt-0.5"><DueLabel due={p.dueDate} open={live} /></div></div></div>
              {p.completedAt && <div className="flex items-start gap-3"><CalendarDays className="w-4 h-4 mt-0.5 text-teal-300" aria-hidden="true" /><div><p className="text-xs" style={{ color: "var(--text-muted)" }}>Completed</p><div>{formatDate(p.completedAt)}</div></div></div>}
              {p.lead && <div className="flex items-start gap-3"><User className="w-4 h-4 mt-0.5 text-cyan-300" aria-hidden="true" /><div><p className="text-xs" style={{ color: "var(--text-muted)" }}>Project lead</p><div>{p.lead}</div></div></div>}
              <div className="pt-1"><p className="sr-only">Priority</p><div><PriorityPill priority={p.priority} /></div></div>
            </div>
          </Section>
          {p.description && (
            <Section title="Description">
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{p.description}</p>
            </Section>
          )}
          {p.notes && (
            <Section title="Internal notes">
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{p.notes}</p>
            </Section>
          )}
          <Section title="Activity">
            {activity.loading && !activity.data ? <LoadingRows rows={3} /> : <ActivityList items={activity.data ?? []} />}
          </Section>
        </div>
      </div>

      <ProjectFormDialog open={dialog === "edit"} onOpenChange={(o) => !o && setDialog(null)} project={p} onSaved={reloadAll} />
      <TaskFormDialog open={dialog === "task"} onOpenChange={(o) => !o && setDialog(null)} businessId={p.businessId} businessName={p.businessName} projectId={p.id} onSaved={reloadAll} />
    </>
  );
}
