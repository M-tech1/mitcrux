"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Archive, ArchiveRestore, FolderPlus, ListPlus, Mail, Phone, MapPin, Globe, CalendarDays, User } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import {
  BUSINESS_STATUSES,
  LIVE_PROJECT_STATUSES,
  STATUS_LABELS,
  describeError,
  getBusiness,
  isTaskOverdue,
  listActivity,
  listProjects,
  listTasks,
  setBusinessStatus,
  type BusinessStatus,
} from "@/lib/operations";
import { useLoad } from "@/components/admin/ops/useLoad";
import { useToast } from "@/components/admin/ops/Toast";
import { ErrorState, LoadingRows, Section, StatusPill, formatDate, EmptyState } from "@/components/admin/ops/ui";
import { ActivityList, ProjectList, TaskList } from "@/components/admin/ops/lists";
import { BusinessFormDialog, ProjectFormDialog, TaskFormDialog } from "@/components/admin/ops/forms";
import { cn } from "@/lib/utils";

const SERVICE_TITLE = Object.fromEntries(SERVICES.map((s) => [s.id, s.title]));
const TABS = ["overview", "projects", "tasks", "activity"] as const;
type Tab = (typeof TABS)[number];

function InfoRow({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-cyan-300" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
        <div className="text-sm break-words">{children}</div>
      </div>
    </div>
  );
}

export default function BusinessProfilePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [dialog, setDialog] = useState<"edit" | "project" | "task" | null>(null);
  const [statusBusy, setStatusBusy] = useState(false);

  const business = useLoad(() => getBusiness(id), [id]);
  const work = useLoad(
    async () => {
      const [projects, openTasks, doneTasks] = await Promise.all([
        listProjects({ businessId: id, includeArchived: true, pageSize: 100 }),
        listTasks({ businessId: id, status: "open", pageSize: 100 }),
        listTasks({ businessId: id, status: "completed", pageSize: 25 }),
      ]);
      return { projects: projects.items, openTasks: openTasks.items, doneTasks: doneTasks.items };
    },
    [id],
  );
  const activity = useLoad(() => listActivity({ businessId: id, limit: 30 }), [id]);

  const reloadAll = () => {
    business.reload();
    work.reload();
    activity.reload();
  };

  const b = business.data;

  const changeStatus = async (status: BusinessStatus) => {
    if (!b || statusBusy) return;
    setStatusBusy(true);
    try {
      await setBusinessStatus(b, status);
      toast(status === "archived" ? `Archived ${b.name}. Its projects and tasks are kept.` : `${b.name} is now ${STATUS_LABELS[status]}`);
      business.reload();
      activity.reload();
    } catch (err) {
      toast(describeError(err), "error");
    } finally {
      setStatusBusy(false);
    }
  };

  if (business.loading && !b) return <LoadingRows rows={5} />;
  if (business.error) return <div className="card-surface"><ErrorState message={business.error} onRetry={business.reload} /></div>;
  if (!b) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>This business doesn&apos;t exist.</p>
        <Link href="/admin/operations/businesses" className="btn-ghost !text-sm">Back to businesses</Link>
      </div>
    );
  }

  const w = work.data;
  const currentProjects = w?.projects.filter((p) => !p.archived && LIVE_PROJECT_STATUSES.includes(p.status)) ?? [];
  const finishedProjects = w?.projects.filter((p) => p.archived || !LIVE_PROJECT_STATUSES.includes(p.status)) ?? [];
  const overdue = w?.openTasks.filter(isTaskOverdue) ?? [];
  const archived = b.status === "archived";

  return (
    <>
      <Link href="/admin/operations/businesses" className="inline-flex items-center gap-1.5 text-sm mb-5 rounded-lg hover:text-[var(--text-primary)]" style={{ color: "var(--text-secondary)" }}>
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Businesses
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-h1 text-3xl md:text-4xl tracking-tight break-words">{b.name}</h1>
            <StatusPill status={b.status} />
          </div>
          <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>{b.category}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="biz-status" className="sr-only">Business status</label>
          <select
            id="biz-status"
            value={b.status}
            onChange={(e) => changeStatus(e.target.value as BusinessStatus)}
            disabled={statusBusy}
            className="field !w-auto !min-h-[40px] !py-2 cursor-pointer"
          >
            {BUSINESS_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button type="button" onClick={() => setDialog("edit")} className="btn-ghost !text-sm !py-2 !min-h-[40px]">
            <Pencil className="w-4 h-4" aria-hidden="true" /> Edit
          </button>
          <button
            type="button"
            onClick={() => changeStatus(archived ? "active" : "archived")}
            disabled={statusBusy}
            className="btn-ghost !text-sm !py-2 !min-h-[40px]"
          >
            {archived ? <ArchiveRestore className="w-4 h-4" aria-hidden="true" /> : <Archive className="w-4 h-4" aria-hidden="true" />}
            {archived ? "Restore" : "Archive"}
          </button>
        </div>
      </div>

      {archived && (
        <p className="mb-5 p-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm" style={{ color: "var(--text-secondary)" }}>
          This business is archived. Its projects, tasks and activity are kept for reference.
        </p>
      )}

      {/* Tabs */}
      <div role="tablist" aria-label="Business sections" className="flex gap-1 mb-6 border-b border-[var(--border-subtle)] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            className={cn(
              "relative shrink-0 px-3.5 py-2.5 text-sm font-medium capitalize transition-colors",
              tab === t ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
          >
            {t}
            {t === "tasks" && overdue.length > 0 && <span className="ml-1.5 text-xs text-red-300">({overdue.length} overdue)</span>}
            {tab === t && <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-brand-400 to-cyan-300" aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {work.error && tab !== "activity" ? (
          <div className="card-surface"><ErrorState message={work.error} onRetry={work.reload} /></div>
        ) : tab === "overview" ? (
          <div className="grid lg:grid-cols-[1fr_22rem] gap-5 items-start">
            <div className="space-y-5 min-w-0">
              <Section
                title={`Open tasks${overdue.length ? ` · ${overdue.length} overdue` : ""}`}
                action={!archived && <button type="button" onClick={() => setDialog("task")} className="text-xs font-medium hover:underline" style={{ color: "var(--text-secondary)" }}>Add task</button>}
              >
                {work.loading && !w ? <LoadingRows rows={3} /> : (
                  <TaskList tasks={(w?.openTasks ?? []).slice(0, 8)} onChanged={() => { work.reload(); activity.reload(); }} showBusiness={false} empty="No open tasks." />
                )}
              </Section>
              <Section title="Current projects">
                {work.loading && !w ? <LoadingRows rows={2} /> : <ProjectList projects={currentProjects} showBusiness={false} empty="No current projects." />}
              </Section>
              {b.description && (
                <Section title="About">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{b.description}</p>
                </Section>
              )}
            </div>
            <div className="space-y-5 min-w-0">
              <Section title="Details">
                <div className="space-y-3.5">
                  {b.contactName && <InfoRow icon={User} label="Contact person">{b.contactName}</InfoRow>}
                  {b.contactEmail && <InfoRow icon={Mail} label="Email"><a href={`mailto:${b.contactEmail}`} className="text-cyan-300 hover:underline">{b.contactEmail}</a></InfoRow>}
                  {b.contactPhone && <InfoRow icon={Phone} label="Phone"><a href={`tel:${b.contactPhone.replace(/\s+/g, "")}`} className="hover:underline">{b.contactPhone}</a></InfoRow>}
                  {b.address && <InfoRow icon={MapPin} label="Address">{b.address}</InfoRow>}
                  {b.website && (
                    <InfoRow icon={Globe} label="Website">
                      <a href={/^https?:\/\//.test(b.website) ? b.website : `https://${b.website}`} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">{b.website}</a>
                    </InfoRow>
                  )}
                  <InfoRow icon={CalendarDays} label="Onboarded">{formatDate(b.onboardedAt)}</InfoRow>
                </div>
              </Section>
              <Section title="Services Mitcrux provides">
                {b.services?.length ? (
                  <ul className="flex flex-wrap gap-1.5">
                    {b.services.map((s) => (
                      <li key={s} className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card-2)]" style={{ color: "var(--text-secondary)" }}>
                        {SERVICE_TITLE[s] ?? s}
                      </li>
                    ))}
                  </ul>
                ) : <EmptyState>No services recorded.</EmptyState>}
              </Section>
              {b.notes && (
                <Section title="Internal notes">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{b.notes}</p>
                </Section>
              )}
            </div>
          </div>
        ) : tab === "projects" ? (
          <div className="space-y-5">
            <Section
              title="Current projects"
              action={!archived && (
                <button type="button" onClick={() => setDialog("project")} className="btn-ghost !text-sm !py-1.5 !min-h-0">
                  <FolderPlus className="w-4 h-4" aria-hidden="true" /> New project
                </button>
              )}
            >
              {work.loading && !w ? <LoadingRows rows={3} /> : <ProjectList projects={currentProjects} showBusiness={false} empty="No current projects." />}
            </Section>
            <Section title="Completed, cancelled and archived">
              {work.loading && !w ? <LoadingRows rows={2} /> : <ProjectList projects={finishedProjects} showBusiness={false} empty="None yet." />}
            </Section>
          </div>
        ) : tab === "tasks" ? (
          <div className="space-y-5">
            <Section
              title="Open tasks"
              action={!archived && (
                <button type="button" onClick={() => setDialog("task")} className="btn-ghost !text-sm !py-1.5 !min-h-0">
                  <ListPlus className="w-4 h-4" aria-hidden="true" /> Add task
                </button>
              )}
            >
              {work.loading && !w ? <LoadingRows rows={4} /> : (
                <TaskList tasks={w?.openTasks ?? []} onChanged={() => { work.reload(); activity.reload(); }} showBusiness={false} empty="No open tasks." />
              )}
            </Section>
            <Section title="Recently completed">
              {work.loading && !w ? <LoadingRows rows={2} /> : (
                <TaskList tasks={w?.doneTasks ?? []} onChanged={() => { work.reload(); activity.reload(); }} showBusiness={false} empty="No completed tasks yet." />
              )}
            </Section>
          </div>
        ) : (
          <Section title="Activity">
            {activity.error ? <ErrorState message={activity.error} onRetry={activity.reload} /> : activity.loading && !activity.data ? <LoadingRows rows={5} /> : <ActivityList items={activity.data ?? []} />}
          </Section>
        )}
      </div>

      <BusinessFormDialog open={dialog === "edit"} onOpenChange={(o) => !o && setDialog(null)} business={b} onSaved={reloadAll} />
      <ProjectFormDialog open={dialog === "project"} onOpenChange={(o) => !o && setDialog(null)} businessId={b.id} businessName={b.name} onSaved={reloadAll} />
      <TaskFormDialog open={dialog === "task"} onOpenChange={(o) => !o && setDialog(null)} businessId={b.id} businessName={b.name} onSaved={reloadAll} />
    </>
  );
}
