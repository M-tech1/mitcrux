"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, FolderPlus, ListPlus, RefreshCw } from "lucide-react";
import {
  getOverviewCounts,
  listActivity,
  listDelayedProjects,
  listRecentBusinesses,
  listTasks,
} from "@/lib/operations";
import { useLoad } from "@/components/admin/ops/useLoad";
import { ErrorState, LoadingRows, PageTitle, Section, StatTile, StatusPill, formatRelative, EmptyState } from "@/components/admin/ops/ui";
import { ActivityList, ProjectList, TaskList } from "@/components/admin/ops/lists";
import { BusinessFormDialog, ProjectFormDialog, TaskFormDialog } from "@/components/admin/ops/forms";

export default function OperationsOverviewPage() {
  const router = useRouter();
  const [dialog, setDialog] = useState<"business" | "project" | "task" | null>(null);

  const counts = useLoad(getOverviewCounts, []);
  const lists = useLoad(
    async () => {
      const [overdue, upcoming, delayed, recent, activity] = await Promise.all([
        listTasks({ due: "overdue", pageSize: 8 }),
        listTasks({ due: "next7", pageSize: 8 }),
        listDelayedProjects(6),
        listRecentBusinesses(5),
        listActivity({ limit: 8 }),
      ]);
      return { overdue: overdue.items, upcoming: upcoming.items, delayed, recent, activity };
    },
    [],
  );

  const refresh = () => {
    counts.reload();
    lists.reload();
  };

  const c = counts.data;
  const l = lists.data;

  return (
    <>
      <PageTitle
        title="Operations"
        description="What Mitcrux is delivering, to whom, and what needs attention."
        actions={
          <>
            <button type="button" onClick={() => setDialog("business")} className="btn-primary !text-sm">
              <Building2 className="w-4 h-4" aria-hidden="true" /> Register business
            </button>
            <button type="button" onClick={() => setDialog("project")} className="btn-ghost !text-sm">
              <FolderPlus className="w-4 h-4" aria-hidden="true" /> New project
            </button>
            <button type="button" onClick={() => setDialog("task")} className="btn-ghost !text-sm">
              <ListPlus className="w-4 h-4" aria-hidden="true" /> Add task
            </button>
            <button type="button" onClick={refresh} className="btn-ghost !text-sm !px-3" aria-label="Refresh">
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
          </>
        }
      />

      {/* Metrics */}
      {counts.error ? (
        <div className="card-surface mb-6"><ErrorState message={counts.error} onRetry={counts.reload} /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatTile label="Registered businesses" value={c?.businesses ?? null} href="/admin/operations/businesses" />
          <StatTile label="Active businesses" value={c?.activeBusinesses ?? null} />
          <StatTile label="Onboarding" value={c?.onboardingBusinesses ?? null} />
          <StatTile label="Active projects" value={c?.activeProjects ?? null} href="/admin/operations/projects" />
          <StatTile label="Completed projects" value={c?.completedProjects ?? null} />
          <StatTile label="Open tasks" value={c?.openTasks ?? null} href="/admin/operations/tasks" />
          <StatTile label="Overdue tasks" value={c?.overdueTasks ?? null} tone="danger" href="/admin/operations/tasks" />
          <StatTile label="Due in the next 7 days" value={c?.dueSoonTasks ?? null} tone="warning" href="/admin/operations/tasks" />
        </div>
      )}

      {lists.error ? (
        <div className="card-surface"><ErrorState message={lists.error} onRetry={lists.reload} /></div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_22rem] gap-5 items-start">
          <div className="space-y-5 min-w-0">
            <Section title="Overdue tasks" action={<Link href="/admin/operations/tasks" className="text-xs font-medium hover:underline" style={{ color: "var(--text-secondary)" }}>View all</Link>}>
              {lists.loading && !l ? <LoadingRows rows={3} /> : (
                <TaskList tasks={l?.overdue ?? []} onChanged={refresh} empty="Nothing overdue." />
              )}
            </Section>
            <Section title="Upcoming deadlines (next 7 days)">
              {lists.loading && !l ? <LoadingRows rows={3} /> : (
                <TaskList tasks={l?.upcoming ?? []} onChanged={refresh} empty="No tasks due in the next 7 days." />
              )}
            </Section>
            <Section title="Projects running late" action={<Link href="/admin/operations/projects" className="text-xs font-medium hover:underline" style={{ color: "var(--text-secondary)" }}>All projects</Link>}>
              {lists.loading && !l ? <LoadingRows rows={2} /> : (
                <ProjectList projects={l?.delayed ?? []} empty="No projects past their expected completion date." />
              )}
            </Section>
          </div>

          <div className="space-y-5 min-w-0">
            <Section title="Recently added businesses">
              {lists.loading && !l ? <LoadingRows rows={3} /> : l?.recent.length ? (
                <ul className="space-y-1">
                  {l.recent.map((b) => (
                    <li key={b.id}>
                      <Link href={`/admin/operations/businesses/${b.id}`} className="flex items-center justify-between gap-3 py-2 rounded-lg group">
                        <span className="min-w-0">
                          <span className="block text-sm font-medium truncate group-hover:text-cyan-300 transition-colors">{b.name}</span>
                          <span className="block text-xs" style={{ color: "var(--text-muted)" }}>{b.category} · {formatRelative(b.createdAt)}</span>
                        </span>
                        <StatusPill status={b.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState>No businesses yet. Register the first one to get started.</EmptyState>
              )}
            </Section>
            <Section title="Recent activity">
              {lists.loading && !l ? <LoadingRows rows={4} /> : <ActivityList items={l?.activity ?? []} />}
            </Section>
          </div>
        </div>
      )}

      <BusinessFormDialog open={dialog === "business"} onOpenChange={(o) => !o && setDialog(null)} onSaved={(id) => router.push(`/admin/operations/businesses/${id}`)} />
      <ProjectFormDialog open={dialog === "project"} onOpenChange={(o) => !o && setDialog(null)} onSaved={(id) => router.push(`/admin/operations/projects/${id}`)} />
      <TaskFormDialog open={dialog === "task"} onOpenChange={(o) => !o && setDialog(null)} onSaved={refresh} />
    </>
  );
}
