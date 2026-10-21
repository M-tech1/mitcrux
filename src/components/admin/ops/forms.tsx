"use client";

import { useEffect, useState } from "react";
import { SERVICES } from "@/lib/constants";
import {
  BUSINESS_STATUSES,
  PRIORITIES,
  PRIORITY_LABELS,
  PROJECT_STATUSES,
  STATUS_LABELS,
  TASK_STATUSES,
  createBusiness,
  createProject,
  createTask,
  dateInputToTimestamp,
  describeError,
  listBusinessOptions,
  listProjectOptions,
  timestampToDateInput,
  updateBusiness,
  updateProject,
  updateTask,
  type Business,
  type BusinessStatus,
  type Priority,
  type Project,
  type ProjectStatus,
  type Task,
  type TaskStatus,
} from "@/lib/operations";
import { Field, Modal } from "@/components/admin/ops/ui";
import { useToast } from "@/components/admin/ops/Toast";
import { cn } from "@/lib/utils";

type Errors = Record<string, string>;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Shared footer ─────────────────────────────────────────────────────── */

function FormActions({ saving, label, onCancel }: { saving: boolean; label: string; onCancel: () => void }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
      <button type="button" onClick={onCancel} className="btn-ghost justify-center" disabled={saving}>
        Cancel
      </button>
      <button type="submit" className="btn-primary justify-center disabled:opacity-60 disabled:pointer-events-none" disabled={saving}>
        {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />}
        {saving ? "Saving…" : label}
      </button>
    </div>
  );
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm p-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300">
      {message}
    </p>
  );
}

/** Builds aria props for a control linked to its Field error */
const invalid = (errors: Errors, key: string, id: string) =>
  errors[key] ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};

/* ═══ Business ══════════════════════════════════════════════════════════ */

export function BusinessFormDialog({
  open,
  onOpenChange,
  business,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business?: Business | null;
  onSaved?: (id: string) => void;
}) {
  const toast = useToast();
  const editing = !!business;
  const blank = {
    name: "", category: "", description: "", contactName: "", contactEmail: "", contactPhone: "",
    address: "", website: "", services: [] as string[], onboardedAt: "", notes: "", status: "onboarding" as BusinessStatus,
  };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setFormError(null);
    setForm(
      business
        ? {
            name: business.name, category: business.category, description: business.description,
            contactName: business.contactName, contactEmail: business.contactEmail, contactPhone: business.contactPhone,
            address: business.address, website: business.website, services: business.services ?? [],
            onboardedAt: timestampToDateInput(business.onboardedAt), notes: business.notes, status: business.status,
          }
        : { ...blank, onboardedAt: timestampToDateInput(null) },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, business]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleService = (id: string) =>
    set("services", form.services.includes(id) ? form.services.filter((s) => s !== id) : [...form.services, id]);

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Enter the business name.";
    if (!form.category.trim()) e.category = "Enter the business category or industry.";
    if (form.contactEmail.trim() && !EMAIL_RE.test(form.contactEmail.trim())) e.contactEmail = "Enter a valid email address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (saving || !validate()) return;
    setSaving(true);
    setFormError(null);
    const input = { ...form, onboardedAt: dateInputToTimestamp(form.onboardedAt) };
    try {
      if (business) {
        await updateBusiness(business.id, input, business);
        toast("Business updated");
        onSaved?.(business.id);
      } else {
        const id = await createBusiness(input);
        toast(`Registered ${form.name.trim()}`);
        onSaved?.(id);
      }
      onOpenChange(false);
    } catch (err) {
      setFormError(describeError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={(o) => !saving && onOpenChange(o)} title={editing ? "Edit business" : "Register a business"} wide>
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="b-name" label="Business name" required error={errors.name}>
            <input id="b-name" className="field" value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={120} autoFocus {...invalid(errors, "name", "b-name")} />
          </Field>
          <Field id="b-category" label="Category or industry" required error={errors.category}>
            <input id="b-category" className="field" list="b-category-list" value={form.category} onChange={(e) => set("category", e.target.value)} maxLength={80} {...invalid(errors, "category", "b-category")} />
            <datalist id="b-category-list">
              {["Retail", "Fintech", "Healthcare", "Education", "Hospitality", "Real estate", "Logistics", "Media", "Non-profit", "Professional services"].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>

        <Field id="b-description" label="Description">
          <textarea id="b-description" className="field min-h-[80px] resize-y" value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={1000} />
        </Field>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field id="b-contact" label="Contact person">
            <input id="b-contact" className="field" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} maxLength={120} autoComplete="off" />
          </Field>
          <Field id="b-email" label="Contact email" error={errors.contactEmail}>
            <input id="b-email" type="email" className="field" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} maxLength={254} autoComplete="off" {...invalid(errors, "contactEmail", "b-email")} />
          </Field>
          <Field id="b-phone" label="Contact phone">
            <input id="b-phone" type="tel" className="field" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} maxLength={40} autoComplete="off" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="b-address" label="Address">
            <input id="b-address" className="field" value={form.address} onChange={(e) => set("address", e.target.value)} maxLength={240} />
          </Field>
          <Field id="b-website" label="Website">
            <input id="b-website" className="field" value={form.website} onChange={(e) => set("website", e.target.value)} maxLength={200} placeholder="example.com" />
          </Field>
        </div>

        <fieldset>
          <legend className="field-label mb-2">
            Services Mitcrux provides <span className="ml-1.5 text-xs font-normal" style={{ color: "var(--text-muted)" }}>optional</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => {
              const on = form.services.includes(s.id);
              return (
                <label
                  key={s.id}
                  className={cn(
                    "cursor-pointer text-xs font-medium px-3 py-1.5 rounded-full border transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-cyan-300",
                    on ? "bg-brand-500/20 border-brand-400/60 text-ice" : "border-[var(--border-card)] hover:border-white/20",
                  )}
                  style={on ? undefined : { color: "var(--text-secondary)" }}
                >
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleService(s.id)} />
                  {s.title}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="b-onboarded" label="Date onboarded">
            <input id="b-onboarded" type="date" className="field" value={form.onboardedAt} onChange={(e) => set("onboardedAt", e.target.value)} />
          </Field>
          <Field id="b-status" label="Status" required>
            <select id="b-status" className="field cursor-pointer" value={form.status} onChange={(e) => set("status", e.target.value as BusinessStatus)}>
              {BUSINESS_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </Field>
        </div>

        <Field id="b-notes" label="Internal notes">
          <textarea id="b-notes" className="field min-h-[80px] resize-y" value={form.notes} onChange={(e) => set("notes", e.target.value)} maxLength={4000} />
        </Field>

        <FormError message={formError} />
        <FormActions saving={saving} label={editing ? "Save changes" : "Register business"} onCancel={() => onOpenChange(false)} />
      </form>
    </Modal>
  );
}

/* ═══ Project ═══════════════════════════════════════════════════════════ */

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  businessId,
  businessName,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  /** Pre-selects (and locks) the business when creating from a business profile */
  businessId?: string;
  businessName?: string;
  onSaved?: (id: string) => void;
}) {
  const toast = useToast();
  const editing = !!project;
  const blank = {
    name: "", code: "", description: "", businessId: businessId ?? "", category: "", startDate: "", dueDate: "",
    status: "planning" as ProjectStatus, priority: "medium" as Priority, lead: "", notes: "",
  };
  const [form, setForm] = useState(blank);
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[] | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setFormError(null);
    setForm(
      project
        ? {
            name: project.name, code: project.code, description: project.description, businessId: project.businessId,
            category: project.category, startDate: timestampToDateInput(project.startDate), dueDate: timestampToDateInput(project.dueDate),
            status: project.status, priority: project.priority, lead: project.lead, notes: project.notes,
          }
        : { ...blank, businessId: businessId ?? "" },
    );
    if (!project && !businessId) {
      setBusinesses(null);
      listBusinessOptions().then(setBusinesses).catch((err) => setFormError(describeError(err)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, project, businessId]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const businessLocked = editing || !!businessId;

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Enter the project name.";
    if (!form.businessId) e.businessId = "Choose the business this project is for.";
    if (form.startDate && form.dueDate && form.dueDate < form.startDate) e.dueDate = "Expected completion can't be before the start date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (saving || !validate()) return;
    setSaving(true);
    setFormError(null);
    const input = { ...form, startDate: dateInputToTimestamp(form.startDate), dueDate: dateInputToTimestamp(form.dueDate) };
    try {
      if (project) {
        await updateProject(project.id, input);
        toast("Project updated");
        onSaved?.(project.id);
      } else {
        const id = await createProject(input);
        toast(`Created project ${form.name.trim()}`);
        onSaved?.(id);
      }
      onOpenChange(false);
    } catch (err) {
      setFormError(describeError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={(o) => !saving && onOpenChange(o)} title={editing ? "Edit project" : "New project"} wide>
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
          <Field id="p-name" label="Project name" required error={errors.name}>
            <input id="p-name" className="field" value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={140} autoFocus {...invalid(errors, "name", "p-name")} />
          </Field>
          <Field id="p-code" label="Reference code">
            <input id="p-code" className="field" value={form.code} onChange={(e) => set("code", e.target.value)} maxLength={40} placeholder="e.g. MX-2026-014" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            id="p-business"
            label="Business"
            required
            error={errors.businessId}
            hint={businessLocked && editing ? "A project stays with the business it was created for." : undefined}
          >
            {businessLocked ? (
              <input id="p-business" className="field opacity-80" value={project?.businessName ?? businessName ?? "Selected business"} disabled readOnly />
            ) : (
              <select id="p-business" className="field cursor-pointer" value={form.businessId} onChange={(e) => set("businessId", e.target.value)} {...invalid(errors, "businessId", "p-business")}>
                <option value="">{businesses ? (businesses.length ? "Choose a business" : "Register a business first") : "Loading…"}</option>
                {businesses?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            )}
          </Field>
          <Field id="p-category" label="Service or category">
            <input id="p-category" className="field" list="p-category-list" value={form.category} onChange={(e) => set("category", e.target.value)} maxLength={120} />
            <datalist id="p-category-list">
              {SERVICES.map((s) => <option key={s.id} value={s.title} />)}
            </datalist>
          </Field>
        </div>

        <Field id="p-description" label="Description">
          <textarea id="p-description" className="field min-h-[80px] resize-y" value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={2000} />
        </Field>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field id="p-start" label="Start date">
            <input id="p-start" type="date" className="field" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </Field>
          <Field id="p-due" label="Expected completion" error={errors.dueDate}>
            <input id="p-due" type="date" className="field" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} {...invalid(errors, "dueDate", "p-due")} />
          </Field>
          <Field id="p-status" label="Status" required>
            <select id="p-status" className="field cursor-pointer" value={form.status} onChange={(e) => set("status", e.target.value as ProjectStatus)}>
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </Field>
          <Field id="p-priority" label="Priority" required>
            <select id="p-priority" className="field cursor-pointer" value={form.priority} onChange={(e) => set("priority", e.target.value as Priority)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
            </select>
          </Field>
        </div>

        <Field id="p-lead" label="Project lead">
          <input id="p-lead" className="field" value={form.lead} onChange={(e) => set("lead", e.target.value)} maxLength={120} placeholder="Name of the person responsible" />
        </Field>

        <Field id="p-notes" label="Internal notes">
          <textarea id="p-notes" className="field min-h-[80px] resize-y" value={form.notes} onChange={(e) => set("notes", e.target.value)} maxLength={4000} />
        </Field>

        <FormError message={formError} />
        <FormActions saving={saving} label={editing ? "Save changes" : "Create project"} onCancel={() => onOpenChange(false)} />
      </form>
    </Modal>
  );
}

/* ═══ Task ══════════════════════════════════════════════════════════════ */

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  businessId,
  businessName: presetBusinessName,
  projectId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  /** Pre-select context when adding from a business or project page */
  businessId?: string;
  businessName?: string;
  projectId?: string;
  onSaved?: (id: string) => void;
}) {
  const toast = useToast();
  const editing = !!task;
  const blank = {
    title: "", description: "", businessId: businessId ?? "", projectId: projectId ?? "",
    priority: "medium" as Priority, status: "todo" as TaskStatus, startDate: "", dueDate: "", assignee: "", completedAt: "", notes: "",
  };
  const [form, setForm] = useState(blank);
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[] | null>(null);
  const [projects, setProjects] = useState<{ id: string; name: string }[] | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setFormError(null);
    setForm(
      task
        ? {
            title: task.title, description: task.description, businessId: task.businessId, projectId: task.projectId ?? "",
            priority: task.priority, status: task.status, startDate: timestampToDateInput(task.startDate),
            dueDate: timestampToDateInput(task.dueDate), assignee: task.assignee, completedAt: timestampToDateInput(task.completedAt), notes: task.notes,
          }
        : { ...blank, businessId: businessId ?? "", projectId: projectId ?? "" },
    );
    if (!task && !businessId) {
      setBusinesses(null);
      listBusinessOptions().then(setBusinesses).catch((err) => setFormError(describeError(err)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task, businessId, projectId]);

  // Projects available for the chosen business
  useEffect(() => {
    if (!open || !form.businessId) {
      setProjects([]);
      return;
    }
    let live = true;
    setProjects(null);
    listProjectOptions(form.businessId)
      .then((p) => live && setProjects(p))
      .catch((err) => live && setFormError(describeError(err)));
    return () => {
      live = false;
    };
  }, [open, form.businessId]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const businessLocked = editing || !!businessId;

  const validate = () => {
    const e: Errors = {};
    if (!form.title.trim()) e.title = "Enter the task title.";
    if (!form.businessId) e.businessId = "Choose the business this task is for.";
    if (form.startDate && form.dueDate && form.dueDate < form.startDate) e.dueDate = "The due date can't be before the start date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (saving || !validate()) return;
    setSaving(true);
    setFormError(null);
    const input = {
      ...form,
      projectId: form.projectId || null,
      startDate: dateInputToTimestamp(form.startDate),
      dueDate: dateInputToTimestamp(form.dueDate),
      completedAt: form.status === "completed" ? dateInputToTimestamp(form.completedAt) : null,
    };
    try {
      if (task) {
        await updateTask(task.id, input);
        toast(form.status === "completed" && task.status !== "completed" ? "Task completed" : "Task updated");
        onSaved?.(task.id);
      } else {
        const id = await createTask(input);
        toast("Task added");
        onSaved?.(id);
      }
      onOpenChange(false);
    } catch (err) {
      setFormError(describeError(err));
    } finally {
      setSaving(false);
    }
  };

  const businessName =
    task?.businessName ?? presetBusinessName ?? businesses?.find((b) => b.id === form.businessId)?.name ?? "Selected business";

  return (
    <Modal open={open} onOpenChange={(o) => !saving && onOpenChange(o)} title={editing ? "Edit task" : "Add a task"} wide>
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field id="t-title" label="Task title" required error={errors.title}>
          <input id="t-title" className="field" value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={160} autoFocus {...invalid(errors, "title", "t-title")} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="t-business" label="Business" required error={errors.businessId}>
            {businessLocked ? (
              <input id="t-business" className="field opacity-80" value={businessName} disabled readOnly />
            ) : (
              <select
                id="t-business"
                className="field cursor-pointer"
                value={form.businessId}
                onChange={(e) => setForm((f) => ({ ...f, businessId: e.target.value, projectId: "" }))}
                {...invalid(errors, "businessId", "t-business")}
              >
                <option value="">{businesses ? (businesses.length ? "Choose a business" : "Register a business first") : "Loading…"}</option>
                {businesses?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            )}
          </Field>
          <Field id="t-project" label="Project">
            <select
              id="t-project"
              className="field cursor-pointer"
              value={form.projectId}
              onChange={(e) => set("projectId", e.target.value)}
              disabled={!form.businessId || projects === null}
            >
              <option value="">{!form.businessId ? "Choose a business first" : projects === null ? "Loading…" : "No project"}</option>
              {projects?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
        </div>

        <Field id="t-description" label="Description">
          <textarea id="t-description" className="field min-h-[80px] resize-y" value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={2000} />
        </Field>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field id="t-status" label="Status" required>
            <select id="t-status" className="field cursor-pointer" value={form.status} onChange={(e) => set("status", e.target.value as TaskStatus)}>
              {TASK_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </Field>
          <Field id="t-priority" label="Priority" required>
            <select id="t-priority" className="field cursor-pointer" value={form.priority} onChange={(e) => set("priority", e.target.value as Priority)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
            </select>
          </Field>
          <Field id="t-start" label="Start date">
            <input id="t-start" type="date" className="field" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </Field>
          <Field id="t-due" label="Due date" error={errors.dueDate}>
            <input id="t-due" type="date" className="field" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} {...invalid(errors, "dueDate", "t-due")} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="t-assignee" label="Assigned to">
            <input id="t-assignee" className="field" value={form.assignee} onChange={(e) => set("assignee", e.target.value)} maxLength={120} placeholder="Name" />
          </Field>
          {form.status === "completed" && (
            <Field id="t-completed" label="Completion date" hint="Leave empty to use today.">
              <input id="t-completed" type="date" className="field" value={form.completedAt} onChange={(e) => set("completedAt", e.target.value)} />
            </Field>
          )}
        </div>

        <Field id="t-notes" label="Internal notes">
          <textarea id="t-notes" className="field min-h-[72px] resize-y" value={form.notes} onChange={(e) => set("notes", e.target.value)} maxLength={4000} />
        </Field>

        <FormError message={formError} />
        <FormActions saving={saving} label={editing ? "Save changes" : "Add task"} onCancel={() => onOpenChange(false)} />
      </form>
    </Modal>
  );
}
