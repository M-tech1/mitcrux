"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Play } from "lucide-react";
import {
  OPEN_TASK_STATUSES,
  PRIORITIES,
  PRIORITY_LABELS,
  PROJECT_STATUSES,
  STATUS_LABELS,
  TASK_STATUSES,
  LIVE_PROJECT_STATUSES,
  addDays,
  dateInputToTimestamp,
  describeError,
  isTaskOverdue,
  listBusinessOptions,
  listTasks,
  loadReportData,
  projectProgress,
  startOfToday,
  timestampToDateInput,
  type Project,
  type ProjectStatus,
  type ReportData,
  type Task,
  type TaskStatus,
} from "@/lib/operations";
import { downloadCsv } from "@/lib/csv";
import { DueLabel, ErrorState, FilterSelect, LoadingRows, PageTitle, PriorityPill, Section, StatTile, StatusPill, formatDate, EmptyState } from "@/components/admin/ops/ui";
import { cn } from "@/lib/utils";

const iso = timestampToDateInput;
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

/* Plain, scannable table wrapper (scrolls sideways on small screens) */
function Table({ head, children, numeric = [] }: { head: string[]; children: React.ReactNode; numeric?: number[] }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm border-collapse min-w-[36rem]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={h}
                scope="col"
                className={cn("px-2 py-2 text-xs font-medium border-b border-[var(--border-card)] whitespace-nowrap", numeric.includes(i) ? "text-right" : "text-left")}
                style={{ color: "var(--text-muted)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:px-2 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-[var(--border-card)] [&_tr:last-child_td]:border-b-0 tabular-nums">{children}</tbody>
      </table>
    </div>
  );
}

function ExportButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline" style={{ color: "var(--text-secondary)" }}>
      <Download className="w-3.5 h-3.5" aria-hidden="true" /> {label}
    </button>
  );
}

export default function ReportsPage() {
  // Default period: the last 90 days
  const [from, setFrom] = useState(() => toInput(addDays(startOfToday(), -90)));
  const [to, setTo] = useState(toInput(startOfToday()));
  const [businessId, setBusinessId] = useState("");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus | "">("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus | "open" | "">("");
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>([]);

  const [data, setData] = useState<(ReportData & { overdue: Task[]; upcoming: Task[] }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rangeError, setRangeError] = useState<string | null>(null);

  useEffect(() => {
    listBusinessOptions().then(setBusinesses).catch(() => {});
  }, []);

  const run = async () => {
    const fromTs = dateInputToTimestamp(from);
    const toDay = dateInputToTimestamp(to);
    if (!fromTs || !toDay) return setRangeError("Choose both a start and an end date.");
    if (toDay.toMillis() < fromTs.toMillis()) return setRangeError("The end date must be on or after the start date.");
    setRangeError(null);
    setLoading(true);
    setError(null);
    try {
      // Inclusive of the whole end day
      const toTs = dateInputToTimestamp(toInput(addDays(toDay.toDate(), 1)))!;
      const [report, overdue, upcoming] = await Promise.all([
        loadReportData({ from: fromTs, to: toTs, businessId: businessId || undefined }),
        listTasks({ businessId: businessId || undefined, due: "overdue", pageSize: 200 }),
        listTasks({ businessId: businessId || undefined, due: "next30", pageSize: 200 }),
      ]);
      setData({ ...report, overdue: overdue.items, upcoming: upcoming.items });
    } catch (err) {
      console.error(err);
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived views (respect the status filters) ── */
  const view = useMemo(() => {
    if (!data) return null;
    const projects = data.projects.filter((p) => !projectStatus || p.status === projectStatus);
    const tasks = data.tasks.filter((t) =>
      !taskStatus ? true : taskStatus === "open" ? OPEN_TASK_STATUSES.includes(t.status) : t.status === taskStatus,
    );
    const nameOf = Object.fromEntries(data.businesses.map((b) => [b.id, b]));

    const projectsByStatus = PROJECT_STATUSES.map((s) => ({ status: s, count: projects.filter((p) => p.status === s).length }));
    const tasksMatrix = TASK_STATUSES.map((s) => ({
      status: s,
      byPriority: PRIORITIES.map((pr) => tasks.filter((t) => t.status === s && t.priority === pr).length),
      total: tasks.filter((t) => t.status === s).length,
    }));
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const outstandingTasks = tasks.filter((t) => OPEN_TASK_STATUSES.includes(t.status)).length;

    // Business-by-business summary of work created in the period
    const ids = Array.from(new Set([...projects.map((p) => p.businessId), ...tasks.map((t) => t.businessId)]));
    const perBusiness = ids
      .map((id) => {
        const bp = projects.filter((p) => p.businessId === id);
        const bt = tasks.filter((t) => t.businessId === id);
        const b = nameOf[id];
        return {
          id,
          name: b?.name ?? bp[0]?.businessName ?? bt[0]?.businessName ?? "Unknown business",
          status: b?.status,
          projects: bp.length,
          liveProjects: bp.filter((p) => !p.archived && LIVE_PROJECT_STATUSES.includes(p.status)).length,
          completedProjects: bp.filter((p) => p.status === "completed").length,
          tasks: bt.length,
          openTasks: bt.filter((t) => OPEN_TASK_STATUSES.includes(t.status)).length,
          completedTasks: bt.filter((t) => t.status === "completed").length,
          overdueTasks: bt.filter(isTaskOverdue).length,
        };
      })
      .sort((a, b) => b.tasks + b.projects - (a.tasks + a.projects));

    const delivered = data.delivered.map((p) => ({
      ...p,
      onTime: !p.dueDate || !p.completedAt ? null : p.completedAt.toMillis() <= addDays(p.dueDate.toDate(), 1).getTime(),
    }));

    return { projects, tasks, projectsByStatus, tasksMatrix, completedTasks, outstandingTasks, perBusiness, delivered };
  }, [data, projectStatus, taskStatus]);

  /* ── CSV exports of the filtered records ── */
  const stamp = `${from}_to_${to}`;
  const exportProjects = (rows: Project[]) =>
    downloadCsv(`mitcrux-projects_${stamp}.csv`,
      ["Project", "Reference", "Business", "Category", "Status", "Priority", "Archived", "Start", "Expected completion", "Completed", "Tasks done", "Tasks total", "Progress %", "Lead"],
      rows.map((p) => [p.name, p.code, p.businessName, p.category, STATUS_LABELS[p.status], PRIORITY_LABELS[p.priority], p.archived ? "Yes" : "No", iso(p.startDate), iso(p.dueDate), iso(p.completedAt), p.taskDone, p.taskTotal, projectProgress(p), p.lead]));
  const exportTasks = (rows: Task[], name: string) =>
    downloadCsv(`mitcrux-${name}_${stamp}.csv`,
      ["Task", "Business", "Project", "Status", "Priority", "Assigned to", "Start", "Due", "Completed", "Overdue"],
      rows.map((t) => [t.title, t.businessName, t.projectName, STATUS_LABELS[t.status], PRIORITY_LABELS[t.priority], t.assignee, iso(t.startDate), iso(t.dueDate), iso(t.completedAt), isTaskOverdue(t) ? "Yes" : "No"]));

  return (
    <>
      <PageTitle title="Reports" description="Operational activity and delivery only. Run a report for a date range; projects and tasks are those created in the period." />

      {/* Filters */}
      <div className="card-surface p-4 sm:p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto] gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label htmlFor="rf-from" className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>From</label>
            <input id="rf-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="field !min-h-[40px] !py-2" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rf-to" className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>To</label>
            <input id="rf-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="field !min-h-[40px] !py-2" />
          </div>
          <FilterSelect id="rf-business" label="Business" value={businessId} onChange={setBusinessId}>
            <option value="">All businesses</option>
            {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </FilterSelect>
          <FilterSelect id="rf-pstatus" label="Project status" value={projectStatus} onChange={(v) => setProjectStatus(v as ProjectStatus | "")}>
            <option value="">All</option>
            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </FilterSelect>
          <FilterSelect id="rf-tstatus" label="Task status" value={taskStatus} onChange={(v) => setTaskStatus(v as TaskStatus | "open" | "")}>
            <option value="">All</option>
            <option value="open">Open</option>
            {TASK_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </FilterSelect>
          <button type="button" onClick={run} disabled={loading} className="btn-primary justify-center col-span-2 md:col-span-1 disabled:opacity-60">
            <Play className="w-4 h-4" aria-hidden="true" /> {loading ? "Running…" : "Run report"}
          </button>
        </div>
        {rangeError && <p role="alert" className="text-xs text-red-300 mt-3">{rangeError}</p>}
        <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>Status filters apply instantly once a report has run. Overdue and upcoming lists always show the current state.</p>
      </div>

      {error ? (
        <div className="card-surface"><ErrorState message={error} onRetry={run} /></div>
      ) : loading && !data ? (
        <LoadingRows rows={6} />
      ) : !view || !data ? (
        <div className="card-surface"><EmptyState>Choose a period and run a report.</EmptyState></div>
      ) : (
        <div className="space-y-5">
          {data.truncated && (
            <p role="status" className="text-sm p-3.5 rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-200">
              This period has more than 1,000 projects or tasks, so the report covers the first 1,000. Narrow the date range for complete figures.
            </p>
          )}

          {/* Headline numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile label="Projects started" value={view.projects.length} />
            <StatTile label="Projects delivered" value={view.delivered.length} />
            <StatTile label="Tasks completed" value={view.completedTasks} />
            <StatTile label="Tasks outstanding" value={view.outstandingTasks} tone="warning" />
          </div>

          <div className="grid lg:grid-cols-2 gap-5 items-start">
            <Section title="Projects by status">
              <Table head={["Status", "Projects", "Share"]} numeric={[1, 2]}>
                {view.projectsByStatus.map((r) => (
                  <tr key={r.status}>
                    <td><StatusPill status={r.status} /></td>
                    <td className="text-right">{r.count}</td>
                    <td className="text-right" style={{ color: "var(--text-secondary)" }}>{pct(r.count, view.projects.length)}%</td>
                  </tr>
                ))}
              </Table>
            </Section>

            <Section title="Completed versus outstanding tasks">
              <Table head={["", "Tasks", "Share"]} numeric={[1, 2]}>
                <tr><td>Completed</td><td className="text-right">{view.completedTasks}</td><td className="text-right" style={{ color: "var(--text-secondary)" }}>{pct(view.completedTasks, view.tasks.length)}%</td></tr>
                <tr><td>Outstanding (to do, in progress, blocked)</td><td className="text-right">{view.outstandingTasks}</td><td className="text-right" style={{ color: "var(--text-secondary)" }}>{pct(view.outstandingTasks, view.tasks.length)}%</td></tr>
                <tr><td>Cancelled</td><td className="text-right">{view.tasks.filter((t) => t.status === "cancelled").length}</td><td className="text-right" style={{ color: "var(--text-secondary)" }}>{pct(view.tasks.filter((t) => t.status === "cancelled").length, view.tasks.length)}%</td></tr>
                <tr><td className="font-semibold">Total</td><td className="text-right font-semibold">{view.tasks.length}</td><td /></tr>
              </Table>
            </Section>
          </div>

          <Section title="Tasks by status and priority" action={<ExportButton onClick={() => exportTasks(view.tasks, "tasks")} label="Export tasks CSV" />}>
            <Table head={["Status", ...PRIORITIES.map((p) => PRIORITY_LABELS[p]), "Total"]} numeric={[1, 2, 3, 4, 5]}>
              {view.tasksMatrix.map((r) => (
                <tr key={r.status}>
                  <td><StatusPill status={r.status} /></td>
                  {r.byPriority.map((n, i) => <td key={i} className="text-right" style={{ color: n ? undefined : "var(--text-muted)" }}>{n}</td>)}
                  <td className="text-right font-semibold">{r.total}</td>
                </tr>
              ))}
            </Table>
          </Section>

          <Section title="Project completion overview" action={<ExportButton onClick={() => exportProjects(view.projects)} label="Export projects CSV" />}>
            {view.projects.length ? (
              <Table head={["Project", "Business", "Status", "Tasks done", "Progress", "Expected completion"]} numeric={[3, 4]}>
                {view.projects.map((p) => (
                  <tr key={p.id}>
                    <td><Link href={`/admin/operations/projects/${p.id}`} className="hover:text-cyan-300">{p.name}</Link></td>
                    <td style={{ color: "var(--text-secondary)" }}>{p.businessName}</td>
                    <td><StatusPill status={p.status} /></td>
                    <td className="text-right">{p.taskDone}/{p.taskTotal}</td>
                    <td className="text-right">{projectProgress(p)}%</td>
                    <td><DueLabel due={p.dueDate} open={!p.archived && LIVE_PROJECT_STATUSES.includes(p.status)} /></td>
                  </tr>
                ))}
              </Table>
            ) : <EmptyState>No projects in this period.</EmptyState>}
          </Section>

          <Section
            title="Business-by-business summary"
            action={
              <ExportButton
                label="Export summary CSV"
                onClick={() =>
                  downloadCsv(`mitcrux-business-summary_${stamp}.csv`,
                    ["Business", "Status", "Projects", "Live projects", "Completed projects", "Tasks", "Open tasks", "Completed tasks", "Overdue tasks"],
                    view.perBusiness.map((b) => [b.name, b.status ? STATUS_LABELS[b.status] : "", b.projects, b.liveProjects, b.completedProjects, b.tasks, b.openTasks, b.completedTasks, b.overdueTasks]))
                }
              />
            }
          >
            {view.perBusiness.length ? (
              <Table head={["Business", "Status", "Projects", "Live", "Completed", "Tasks", "Open", "Done", "Overdue"]} numeric={[2, 3, 4, 5, 6, 7, 8]}>
                {view.perBusiness.map((b) => (
                  <tr key={b.id}>
                    <td><Link href={`/admin/operations/businesses/${b.id}`} className="hover:text-cyan-300">{b.name}</Link></td>
                    <td>{b.status ? <StatusPill status={b.status} /> : "—"}</td>
                    <td className="text-right">{b.projects}</td>
                    <td className="text-right">{b.liveProjects}</td>
                    <td className="text-right">{b.completedProjects}</td>
                    <td className="text-right">{b.tasks}</td>
                    <td className="text-right">{b.openTasks}</td>
                    <td className="text-right">{b.completedTasks}</td>
                    <td className={cn("text-right", b.overdueTasks && "text-red-300 font-semibold")}>{b.overdueTasks}</td>
                  </tr>
                ))}
              </Table>
            ) : <EmptyState>No business activity in this period.</EmptyState>}
          </Section>

          <Section title="Delivery history (projects completed in this period)" action={<ExportButton onClick={() => exportProjects(view.delivered)} label="Export CSV" />}>
            {view.delivered.length ? (
              <Table head={["Project", "Business", "Expected", "Delivered", "Timing"]}>
                {view.delivered.map((p) => (
                  <tr key={p.id}>
                    <td><Link href={`/admin/operations/projects/${p.id}`} className="hover:text-cyan-300">{p.name}</Link></td>
                    <td style={{ color: "var(--text-secondary)" }}>{p.businessName}</td>
                    <td>{formatDate(p.dueDate)}</td>
                    <td>{formatDate(p.completedAt)}</td>
                    <td>
                      {p.onTime === null ? <span style={{ color: "var(--text-muted)" }}>No target date</span>
                        : p.onTime ? <span className="text-teal-300">On time</span>
                        : <span className="text-amber-300">Late</span>}
                    </td>
                  </tr>
                ))}
              </Table>
            ) : <EmptyState>No projects were completed in this period.</EmptyState>}
          </Section>

          <div className="grid lg:grid-cols-2 gap-5 items-start">
            <Section title={`Overdue tasks now (${data.overdue.length})`} action={<ExportButton onClick={() => exportTasks(data.overdue, "overdue-tasks")} label="Export CSV" />}>
              {data.overdue.length ? (
                <Table head={["Task", "Business", "Priority", "Due"]}>
                  {data.overdue.map((t) => (
                    <tr key={t.id}>
                      <td>{t.title}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{t.businessName}</td>
                      <td><PriorityPill priority={t.priority} /></td>
                      <td><DueLabel due={t.dueDate} open /></td>
                    </tr>
                  ))}
                </Table>
              ) : <EmptyState>Nothing overdue.</EmptyState>}
            </Section>
            <Section title={`Upcoming deadlines, next 30 days (${data.upcoming.length})`} action={<ExportButton onClick={() => exportTasks(data.upcoming, "upcoming-tasks")} label="Export CSV" />}>
              {data.upcoming.length ? (
                <Table head={["Task", "Business", "Priority", "Due"]}>
                  {data.upcoming.map((t) => (
                    <tr key={t.id}>
                      <td>{t.title}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{t.businessName}</td>
                      <td><PriorityPill priority={t.priority} /></td>
                      <td><DueLabel due={t.dueDate} open /></td>
                    </tr>
                  ))}
                </Table>
              ) : <EmptyState>No deadlines in the next 30 days.</EmptyState>}
            </Section>
          </div>
        </div>
      )}
    </>
  );
}

function toInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
