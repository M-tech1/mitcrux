"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus } from "lucide-react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
  PRIORITIES,
  PRIORITY_LABELS,
  PROJECT_STATUSES,
  STATUS_LABELS,
  describeError,
  listBusinessOptions,
  listProjects,
  type DeadlineFilter,
  type Priority,
  type Project,
  type ProjectStatus,
} from "@/lib/operations";
import { ErrorState, FilterSelect, LoadingRows, PageTitle } from "@/components/admin/ops/ui";
import { LoadMore, ProjectList } from "@/components/admin/ops/lists";
import { ProjectFormDialog } from "@/components/admin/ops/forms";

export default function ProjectsPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [deadline, setDeadline] = useState<DeadlineFilter>("any");
  const [includeArchived, setIncludeArchived] = useState(false);

  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>([]);
  const [items, setItems] = useState<Project[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    listBusinessOptions().then(setBusinesses).catch(() => {});
  }, []);

  const load = async (append: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const page = await listProjects({ businessId, status, priority, deadline, includeArchived, cursor: append ? cursor : null });
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
  }, [businessId, status, priority, deadline, includeArchived]);

  // Deadline views cover live projects only
  const statusOptions = deadline === "any" ? PROJECT_STATUSES : (["planning", "active", "on_hold"] as const);

  return (
    <>
      <PageTitle
        title="Projects"
        description="Progress reflects completed tasks. Late projects are past their expected completion date."
        actions={
          <button type="button" onClick={() => setCreateOpen(true)} className="btn-primary !text-sm">
            <FolderPlus className="w-4 h-4" aria-hidden="true" /> New project
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-3 items-end mb-5">
        <FilterSelect id="pf-business" label="Business" value={businessId} onChange={setBusinessId}>
          <option value="">All businesses</option>
          {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </FilterSelect>
        <FilterSelect id="pf-status" label="Status" value={status} onChange={(v) => setStatus(v as ProjectStatus | "")}>
          <option value="">{deadline === "any" ? "All statuses" : "All live statuses"}</option>
          {statusOptions.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </FilterSelect>
        <FilterSelect id="pf-priority" label="Priority" value={priority} onChange={(v) => setPriority(v as Priority | "")}>
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
        </FilterSelect>
        <FilterSelect
          id="pf-deadline"
          label="Deadline"
          value={deadline}
          onChange={(v) => {
            setDeadline(v as DeadlineFilter);
            if (v !== "any" && (status === "completed" || status === "cancelled")) setStatus("");
          }}
        >
          <option value="any">Any time</option>
          <option value="overdue">Running late</option>
          <option value="next14">Due in the next 14 days</option>
        </FilterSelect>
        <label className="col-span-2 md:col-span-1 flex items-center gap-2 text-sm min-h-[40px] cursor-pointer" style={{ color: "var(--text-secondary)" }}>
          <input type="checkbox" checked={includeArchived} onChange={(e) => setIncludeArchived(e.target.checked)} className="w-4 h-4 accent-blue-500" />
          Include archived
        </label>
      </div>

      <div className="card-surface px-4 sm:px-5 py-2">
        {error ? (
          <ErrorState message={error} onRetry={() => load(false)} />
        ) : loading && !items.length ? (
          <div className="py-3"><LoadingRows /></div>
        ) : (
          <>
            <ProjectList projects={items} empty="No projects match these filters." />
            <LoadMore hasMore={hasMore} loading={loading} onClick={() => load(true)} />
          </>
        )}
      </div>

      <ProjectFormDialog open={createOpen} onOpenChange={setCreateOpen} onSaved={(id) => router.push(`/admin/operations/projects/${id}`)} />
    </>
  );
}
