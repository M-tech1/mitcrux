"use client";

import { useEffect, useState } from "react";
import { ListPlus, Search, X } from "lucide-react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
  PRIORITIES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_STATUSES,
  describeError,
  listAttentionTasks,
  listBusinessOptions,
  listProjectOptions,
  listTasks,
  type Priority,
  type Task,
  type TaskDueFilter,
  type TaskStatus,
} from "@/lib/operations";
import { useLoad } from "@/components/admin/ops/useLoad";
import { ErrorState, FilterSelect, LoadingRows, PageTitle, Section } from "@/components/admin/ops/ui";
import { LoadMore, TaskList } from "@/components/admin/ops/lists";
import { TaskFormDialog } from "@/components/admin/ops/forms";
import { cn } from "@/lib/utils";

type View = "attention" | "all";

/* ── Focused view: what needs action now ───────────────────────────────── */
function AttentionView({ version }: { version: number }) {
  const data = useLoad(listAttentionTasks, [version]);
  if (data.error) return <div className="card-surface"><ErrorState message={data.error} onRetry={data.reload} /></div>;
  const d = data.data;
  const loading = data.loading && !d;
  return (
    <div className="grid lg:grid-cols-2 gap-5 items-start">
      <Section title={`Overdue${d ? ` (${d.overdue.length})` : ""}`} className="lg:col-span-2">
        {loading ? <LoadingRows rows={3} /> : <TaskList tasks={d?.overdue ?? []} onChanged={data.reload} empty="Nothing overdue." />}
      </Section>
      <Section title={`Due in the next 7 days${d ? ` (${d.dueSoon.length})` : ""}`}>
        {loading ? <LoadingRows rows={3} /> : <TaskList tasks={d?.dueSoon ?? []} onChanged={data.reload} empty="Nothing due this week." />}
      </Section>
      <Section title={`Blocked${d ? ` (${d.blocked.length})` : ""}`}>
        {loading ? <LoadingRows rows={3} /> : <TaskList tasks={d?.blocked ?? []} onChanged={data.reload} empty="No blocked tasks." />}
      </Section>
    </div>
  );
}

/* ── Full, filterable list ─────────────────────────────────────────────── */
function AllTasksView({ version }: { version: number }) {
  const [businessId, setBusinessId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState<TaskStatus | "open" | "">("open");
  const [priority, setPriority] = useState<Priority | "">("");
  const [due, setDue] = useState<TaskDueFilter>("any");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");

  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [items, setItems] = useState<Task[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listBusinessOptions().then(setBusinesses).catch(() => {});
  }, []);

  useEffect(() => {
    setProjectId("");
    if (!businessId) return setProjects([]);
    listProjectOptions(businessId).then(setProjects).catch(() => setProjects([]));
  }, [businessId]);

  useEffect(() => {
    const t = setTimeout(() => setTerm(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = async (append: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const page = await listTasks({ businessId, projectId, status, priority, due, search: term, cursor: append ? cursor : null });
      setItems((prev) => (append ? [...prev, ...page.items] : page.items));
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (err) {
      console.error(err);
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, projectId, status, priority, due, term, version]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 items-end mb-5">
        <div className="col-span-2 md:col-span-3 xl:col-span-2 relative">
          <label htmlFor="tf-search" className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>Search by title</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
            <input id="tf-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Task title starts with…" className="field !pl-10 !pr-10 !min-h-[40px] !py-2" />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5" style={{ color: "var(--text-muted)" }}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <FilterSelect id="tf-business" label="Business" value={businessId} onChange={setBusinessId}>
          <option value="">All businesses</option>
          {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </FilterSelect>
        <FilterSelect id="tf-project" label="Project" value={projectId} onChange={setProjectId}>
          <option value="">{businessId ? "All projects" : "Pick a business first"}</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </FilterSelect>
        <FilterSelect id="tf-status" label="Status" value={status} onChange={(v) => setStatus(v as TaskStatus | "open" | "")}>
          <option value="open">Open (to do, in progress, blocked)</option>
          <option value="">All statuses</option>
          {TASK_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </FilterSelect>
        <div className="grid grid-cols-2 gap-3 col-span-2 md:col-span-3 xl:col-span-1 xl:grid-cols-1">
          <FilterSelect id="tf-priority" label="Priority" value={priority} onChange={(v) => setPriority(v as Priority | "")}>
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
          </FilterSelect>
          <FilterSelect id="tf-due" label="Due" value={due} onChange={(v) => setDue(v as TaskDueFilter)}>
            <option value="any">Any time</option>
            <option value="overdue">Overdue</option>
            <option value="next7">Next 7 days</option>
            <option value="next30">Next 30 days</option>
          </FilterSelect>
        </div>
      </div>

      <div className="card-surface px-4 sm:px-5 py-2">
        {error ? (
          <ErrorState message={error} onRetry={() => load(false)} />
        ) : loading && !items.length ? (
          <div className="py-3"><LoadingRows /></div>
        ) : (
          <>
            <TaskList tasks={items} onChanged={() => load(false)} empty="No tasks match these filters." />
            <LoadMore hasMore={hasMore} loading={loading} onClick={() => load(true)} />
          </>
        )}
      </div>
      {term && <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>Search matches the start of task titles (up to 60 results), then applies the other filters.</p>}
    </>
  );
}

export default function TasksPage() {
  const [view, setView] = useState<View>("attention");
  const [createOpen, setCreateOpen] = useState(false);
  const [version, setVersion] = useState(0);

  return (
    <>
      <PageTitle
        title="Tasks"
        description="Tick a task to complete it, or open it to edit. Overdue work is marked in red."
        actions={
          <button type="button" onClick={() => setCreateOpen(true)} className="btn-primary !text-sm">
            <ListPlus className="w-4 h-4" aria-hidden="true" /> Add task
          </button>
        }
      />

      <div className="inline-flex gap-1 rounded-xl p-1 mb-6 border border-[var(--glass-border)] bg-[var(--glass-bg)]" role="group" aria-label="Task view">
        {([["attention", "Needs attention"], ["all", "All tasks"]] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            aria-pressed={view === key}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
              view === key ? "bg-[var(--bg-card)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "attention" ? <AttentionView version={version} /> : <AllTasksView version={version} />}

      <TaskFormDialog open={createOpen} onOpenChange={setCreateOpen} onSaved={() => setVersion((v) => v + 1)} />
    </>
  );
}
