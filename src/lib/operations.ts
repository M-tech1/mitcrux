"use client";

/*
 * Business Operations data layer (Cloud Firestore).
 *
 * Collections (flat, linked by id so the overview and reports can query across businesses):
 *   businesses/{id}
 *   projects/{id}   → businessId
 *   tasks/{id}      → businessId, projectId | null
 *   activity/{id}   → businessId, projectId?, append-only log
 *
 * Free-tier friendly: counts use aggregation queries, lists are paginated, nothing
 * uses real-time listeners, and project progress is kept as counters on the project
 * (taskTotal / taskDone) updated atomically with each task write.
 * Nothing is ever hard-deleted: businesses and projects are archived, tasks cancelled.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as qLimit,
  startAfter,
  getCountFromServer,
  writeBatch,
  runTransaction,
  increment,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
  type Query,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type Transaction,
  type WriteBatch,
} from "firebase/firestore";
import { db } from "./firebase";

/* ═══ Enums ═════════════════════════════════════════════════════════════ */

export const BUSINESS_STATUSES = ["onboarding", "active", "on_hold", "completed", "archived"] as const;
export const PROJECT_STATUSES  = ["planning", "active", "on_hold", "completed", "cancelled"] as const;
export const TASK_STATUSES     = ["todo", "in_progress", "blocked", "completed", "cancelled"] as const;
export const PRIORITIES        = ["low", "medium", "high", "urgent"] as const;

export type BusinessStatus = (typeof BUSINESS_STATUSES)[number];
export type ProjectStatus  = (typeof PROJECT_STATUSES)[number];
export type TaskStatus     = (typeof TASK_STATUSES)[number];
export type Priority       = (typeof PRIORITIES)[number];

/** Work that is still outstanding */
export const OPEN_TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "blocked"];
/** Projects that can still run late */
export const LIVE_PROJECT_STATUSES: ProjectStatus[] = ["planning", "active", "on_hold"];
/** Business statuses shown in the default list (archived has its own filter) */
export const CURRENT_BUSINESS_STATUSES: BusinessStatus[] = ["onboarding", "active", "on_hold", "completed"];

/* ═══ Records ═══════════════════════════════════════════════════════════ */

export interface Business {
  id: string;
  name: string;
  nameLower: string;
  category: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website: string;
  services: string[];
  onboardedAt: Timestamp | null;
  notes: string;
  status: BusinessStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Project {
  id: string;
  name: string;
  nameLower: string;
  code: string;
  description: string;
  businessId: string;
  businessName: string;
  category: string;
  startDate: Timestamp | null;
  dueDate: Timestamp | null;
  status: ProjectStatus;
  priority: Priority;
  lead: string;
  notes: string;
  archived: boolean;
  /** Non-cancelled tasks linked to the project */
  taskTotal: number;
  /** Completed tasks linked to the project */
  taskDone: number;
  completedAt: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Task {
  id: string;
  title: string;
  titleLower: string;
  description: string;
  businessId: string;
  businessName: string;
  projectId: string | null;
  projectName: string;
  priority: Priority;
  status: TaskStatus;
  startDate: Timestamp | null;
  dueDate: Timestamp | null;
  assignee: string;
  completedAt: Timestamp | null;
  notes: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type ActivityKind = "business" | "project" | "task";

export interface Activity {
  id: string;
  kind: ActivityKind;
  businessId: string;
  projectId: string | null;
  entityId: string;
  message: string;
  at: Timestamp | null;
}

export type BusinessInput = Omit<Business, "id" | "nameLower" | "createdAt" | "updatedAt">;
export type ProjectInput = Pick<
  Project,
  "name" | "code" | "description" | "businessId" | "category" | "startDate" | "dueDate" | "status" | "priority" | "lead" | "notes"
>;
export type TaskInput = Pick<
  Task,
  "title" | "description" | "businessId" | "projectId" | "priority" | "status" | "startDate" | "dueDate" | "assignee" | "completedAt" | "notes"
>;

/* ═══ Dates ═════════════════════════════════════════════════════════════ */

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** "YYYY-MM-DD" from an <input type="date"> → local-midnight Timestamp */
export function dateInputToTimestamp(value: string): Timestamp | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return Timestamp.fromDate(new Date(y, m - 1, d));
}

export function timestampToDateInput(ts: Timestamp | null | undefined) {
  if (!ts) return "";
  const d = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Overdue = due before today and still open */
export function isTaskOverdue(t: Pick<Task, "dueDate" | "status">) {
  return !!t.dueDate && OPEN_TASK_STATUSES.includes(t.status) && t.dueDate.toDate() < startOfToday();
}

export function isProjectLate(p: Pick<Project, "dueDate" | "status" | "archived">) {
  return !p.archived && !!p.dueDate && LIVE_PROJECT_STATUSES.includes(p.status) && p.dueDate.toDate() < startOfToday();
}

export function projectProgress(p: Pick<Project, "taskTotal" | "taskDone">) {
  return p.taskTotal > 0 ? Math.round((p.taskDone / p.taskTotal) * 100) : 0;
}

/* ═══ Errors ════════════════════════════════════════════════════════════ */

/** Turns Firestore errors into something an admin can act on */
export function describeError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code === "permission-denied") {
    return "Access denied. Make sure the Firestore rules in firestore.rules are published and you are signed in as the admin account.";
  }
  if (code === "failed-precondition") {
    return "This view needs a Firestore index. Deploy firestore.indexes.json, or open the index link shown in the browser console.";
  }
  if (code === "unavailable") return "You appear to be offline. Check your connection and try again.";
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong. Please try again.";
}

/* ═══ Internals ═════════════════════════════════════════════════════════ */

const businessesCol = () => collection(db, "businesses");
const projectsCol   = () => collection(db, "projects");
const tasksCol      = () => collection(db, "tasks");
const activityCol   = () => collection(db, "activity");

const fromDoc = <T>(d: DocumentSnapshot<DocumentData>) => ({ id: d.id, ...(d.data() as object) }) as T;

const countOf = async (q: Query<DocumentData>) => (await getCountFromServer(q)).data().count;

export interface Page<T> {
  items: T[];
  cursor: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

async function fetchPage<T>(
  base: Query<DocumentData>,
  cursor: QueryDocumentSnapshot<DocumentData> | null,
  size: number,
): Promise<Page<T>> {
  const q = cursor ? query(base, startAfter(cursor), qLimit(size + 1)) : query(base, qLimit(size + 1));
  const snap = await getDocs(q);
  const docs = snap.docs.slice(0, size);
  return {
    items: docs.map((d) => fromDoc<T>(d)),
    cursor: docs.length ? docs[docs.length - 1] : null,
    hasMore: snap.docs.length > size,
  };
}

function logActivity(
  writer: WriteBatch | Transaction,
  entry: Omit<Activity, "id" | "at">,
) {
  const ref = doc(activityCol());
  // WriteBatch and Transaction share the same set() shape
  (writer as WriteBatch).set(ref, { ...entry, at: serverTimestamp() });
}

const clean = (s: string | undefined | null) => (s ?? "").trim();

/** Progress counter contribution of a task */
const counts = (status: TaskStatus) => ({
  total: status === "cancelled" ? 0 : 1,
  done: status === "completed" ? 1 : 0,
});

/** Firestore batches allow 500 writes; keep headroom */
async function updateInChunks(refs: DocumentSnapshot[], data: Record<string, unknown>) {
  for (let i = 0; i < refs.length; i += 400) {
    const batch = writeBatch(db);
    refs.slice(i, i + 400).forEach((d) => batch.update(d.ref, data));
    await batch.commit();
  }
}

/* ═══ Labels used in activity messages ══════════════════════════════════ */

export const STATUS_LABELS: Record<BusinessStatus | ProjectStatus | TaskStatus, string> = {
  onboarding: "Onboarding",
  active: "Active",
  on_hold: "On hold",
  completed: "Completed",
  archived: "Archived",
  planning: "Planning",
  cancelled: "Cancelled",
  todo: "To do",
  in_progress: "In progress",
  blocked: "Blocked",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

/* ═══ Businesses ════════════════════════════════════════════════════════ */

function businessPayload(input: BusinessInput) {
  return {
    name: clean(input.name),
    nameLower: clean(input.name).toLowerCase(),
    category: clean(input.category),
    description: clean(input.description),
    contactName: clean(input.contactName),
    contactEmail: clean(input.contactEmail),
    contactPhone: clean(input.contactPhone),
    address: clean(input.address),
    website: clean(input.website),
    services: input.services ?? [],
    onboardedAt: input.onboardedAt ?? null,
    notes: clean(input.notes),
    status: input.status,
  };
}

export async function createBusiness(input: BusinessInput): Promise<string> {
  const ref = doc(businessesCol());
  const batch = writeBatch(db);
  const data = businessPayload(input);
  batch.set(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  logActivity(batch, {
    kind: "business",
    businessId: ref.id,
    projectId: null,
    entityId: ref.id,
    message: `Registered business “${data.name}”`,
  });
  await batch.commit();
  return ref.id;
}

export async function updateBusiness(id: string, input: BusinessInput, previous: Business): Promise<void> {
  const data = businessPayload(input);
  const batch = writeBatch(db);
  batch.update(doc(db, "businesses", id), { ...data, updatedAt: serverTimestamp() });
  logActivity(batch, {
    kind: "business",
    businessId: id,
    projectId: null,
    entityId: id,
    message:
      previous.status !== data.status
        ? `Business “${data.name}” moved to ${STATUS_LABELS[data.status]}`
        : `Updated business “${data.name}”`,
  });
  await batch.commit();

  // Keep the denormalised name on projects and tasks in step after a rename
  if (previous.name !== data.name) {
    const [p, t] = await Promise.all([
      getDocs(query(projectsCol(), where("businessId", "==", id))),
      getDocs(query(tasksCol(), where("businessId", "==", id))),
    ]);
    await updateInChunks([...p.docs, ...t.docs], { businessName: data.name });
  }
}

export async function setBusinessStatus(business: Business, status: BusinessStatus): Promise<void> {
  if (business.status === status) return;
  const batch = writeBatch(db);
  batch.update(doc(db, "businesses", business.id), { status, updatedAt: serverTimestamp() });
  logActivity(batch, {
    kind: "business",
    businessId: business.id,
    projectId: null,
    entityId: business.id,
    message:
      status === "archived"
        ? `Archived business “${business.name}” (projects and tasks kept)`
        : `Business “${business.name}” moved to ${STATUS_LABELS[status]}`,
  });
  await batch.commit();
}

export async function getBusiness(id: string): Promise<Business | null> {
  const snap = await getDoc(doc(db, "businesses", id));
  return snap.exists() ? fromDoc<Business>(snap) : null;
}

export async function listBusinesses(opts: {
  status: "current" | BusinessStatus;
  search?: string;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
  pageSize?: number;
}): Promise<Page<Business>> {
  const size = opts.pageSize ?? 20;
  const term = clean(opts.search).toLowerCase();

  // Name search: prefix match on nameLower; status is then applied to the matches
  if (term) {
    const snap = await getDocs(
      query(businessesCol(), where("nameLower", ">=", term), where("nameLower", "<=", term + ""), orderBy("nameLower"), qLimit(50)),
    );
    const items = snap.docs
      .map((d) => fromDoc<Business>(d))
      .filter((b) => (opts.status === "current" ? b.status !== "archived" : b.status === opts.status));
    return { items, cursor: null, hasMore: false };
  }

  const statusFilter =
    opts.status === "current" ? where("status", "in", CURRENT_BUSINESS_STATUSES) : where("status", "==", opts.status);
  return fetchPage<Business>(query(businessesCol(), statusFilter, orderBy("createdAt", "desc")), opts.cursor ?? null, size);
}

/** Lightweight list for pickers (excludes archived). Small by nature for an agency client list. */
export async function listBusinessOptions(): Promise<Pick<Business, "id" | "name" | "status">[]> {
  const snap = await getDocs(query(businessesCol(), orderBy("nameLower"), qLimit(500)));
  return snap.docs
    .map((d) => fromDoc<Business>(d))
    .filter((b) => b.status !== "archived")
    .map(({ id, name, status }) => ({ id, name, status }));
}

/* ═══ Projects ══════════════════════════════════════════════════════════ */

function projectPayload(input: ProjectInput) {
  return {
    name: clean(input.name),
    nameLower: clean(input.name).toLowerCase(),
    code: clean(input.code),
    description: clean(input.description),
    category: clean(input.category),
    startDate: input.startDate ?? null,
    dueDate: input.dueDate ?? null,
    status: input.status,
    priority: input.priority,
    lead: clean(input.lead),
    notes: clean(input.notes),
  };
}

export async function createProject(input: ProjectInput): Promise<string> {
  const ref = doc(projectsCol());
  await runTransaction(db, async (tx) => {
    const business = await tx.get(doc(db, "businesses", input.businessId));
    if (!business.exists()) throw new Error("The selected business no longer exists.");
    const data = projectPayload(input);
    tx.set(ref, {
      ...data,
      businessId: input.businessId,
      businessName: (business.data() as Business).name,
      archived: false,
      taskTotal: 0,
      taskDone: 0,
      completedAt: data.status === "completed" ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    logActivity(tx, {
      kind: "project",
      businessId: input.businessId,
      projectId: ref.id,
      entityId: ref.id,
      message: `Created project “${data.name}”`,
    });
  });
  return ref.id;
}

/** The owning business is fixed after creation so task history and counters stay consistent. */
export async function updateProject(id: string, input: ProjectInput): Promise<void> {
  let renamed: string | null = null;
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(doc(db, "projects", id));
    if (!snap.exists()) throw new Error("This project no longer exists.");
    const prev = fromDoc<Project>(snap);
    const data = projectPayload(input);
    const becameComplete = data.status === "completed" && prev.status !== "completed";
    tx.update(snap.ref, {
      ...data,
      completedAt: data.status === "completed" ? (becameComplete ? serverTimestamp() : prev.completedAt) : null,
      updatedAt: serverTimestamp(),
    });
    logActivity(tx, {
      kind: "project",
      businessId: prev.businessId,
      projectId: id,
      entityId: id,
      message:
        prev.status !== data.status
          ? `Project “${data.name}” moved to ${STATUS_LABELS[data.status]}`
          : `Updated project “${data.name}”`,
    });
    if (prev.name !== data.name) renamed = data.name;
  });

  if (renamed) {
    const t = await getDocs(query(tasksCol(), where("projectId", "==", id)));
    await updateInChunks(t.docs, { projectName: renamed });
  }
}

export async function setProjectStatus(project: Project, status: ProjectStatus): Promise<void> {
  await updateProject(project.id, { ...project, status });
}

export async function setProjectArchived(project: Project, archived: boolean): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, "projects", project.id), { archived, updatedAt: serverTimestamp() });
  logActivity(batch, {
    kind: "project",
    businessId: project.businessId,
    projectId: project.id,
    entityId: project.id,
    message: archived ? `Archived project “${project.name}”` : `Restored project “${project.name}”`,
  });
  await batch.commit();
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? fromDoc<Project>(snap) : null;
}

export type DeadlineFilter = "any" | "overdue" | "next14";

export async function listProjects(opts: {
  businessId?: string;
  status?: ProjectStatus | "";
  priority?: Priority | "";
  deadline?: DeadlineFilter;
  includeArchived?: boolean;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
  pageSize?: number;
}): Promise<Page<Project>> {
  const c: QueryConstraint[] = [];
  if (!opts.includeArchived) c.push(where("archived", "==", false));
  if (opts.businessId) c.push(where("businessId", "==", opts.businessId));
  if (opts.priority) c.push(where("priority", "==", opts.priority));

  const today = Timestamp.fromDate(startOfToday());
  if (opts.deadline === "overdue") {
    c.push(opts.status ? where("status", "==", opts.status) : where("status", "in", LIVE_PROJECT_STATUSES));
    c.push(where("dueDate", "<", today), orderBy("dueDate", "asc"));
  } else if (opts.deadline === "next14") {
    c.push(opts.status ? where("status", "==", opts.status) : where("status", "in", LIVE_PROJECT_STATUSES));
    c.push(where("dueDate", ">=", today), where("dueDate", "<", Timestamp.fromDate(addDays(startOfToday(), 14))), orderBy("dueDate", "asc"));
  } else {
    if (opts.status) c.push(where("status", "==", opts.status));
    c.push(orderBy("createdAt", "desc"));
  }
  return fetchPage<Project>(query(projectsCol(), ...c), opts.cursor ?? null, opts.pageSize ?? 20);
}

/** Projects a task can be attached to (same business, not archived) */
export async function listProjectOptions(businessId: string): Promise<Pick<Project, "id" | "name" | "status">[]> {
  if (!businessId) return [];
  const snap = await getDocs(query(projectsCol(), where("businessId", "==", businessId), where("archived", "==", false)));
  return snap.docs
    .map((d) => fromDoc<Project>(d))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name, status }) => ({ id, name, status }));
}

/* ═══ Tasks ═════════════════════════════════════════════════════════════ */

function taskPayload(input: TaskInput) {
  return {
    title: clean(input.title),
    titleLower: clean(input.title).toLowerCase(),
    description: clean(input.description),
    priority: input.priority,
    status: input.status,
    startDate: input.startDate ?? null,
    dueDate: input.dueDate ?? null,
    assignee: clean(input.assignee),
    notes: clean(input.notes),
  };
}

export async function createTask(input: TaskInput): Promise<string> {
  const ref = doc(tasksCol());
  await runTransaction(db, async (tx) => {
    const business = await tx.get(doc(db, "businesses", input.businessId));
    if (!business.exists()) throw new Error("The selected business no longer exists.");

    let projectName = "";
    if (input.projectId) {
      const project = await tx.get(doc(db, "projects", input.projectId));
      if (!project.exists()) throw new Error("The selected project no longer exists.");
      const p = project.data() as Project;
      if (p.businessId !== input.businessId) throw new Error("That project belongs to a different business.");
      projectName = p.name;
    }

    const data = taskPayload(input);
    const isDone = data.status === "completed";
    tx.set(ref, {
      ...data,
      businessId: input.businessId,
      businessName: (business.data() as Business).name,
      projectId: input.projectId || null,
      projectName,
      completedAt: isDone ? input.completedAt ?? Timestamp.now() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (input.projectId) {
      const { total, done } = counts(data.status);
      if (total || done) {
        tx.update(doc(db, "projects", input.projectId), { taskTotal: increment(total), taskDone: increment(done) });
      }
    }

    logActivity(tx, {
      kind: "task",
      businessId: input.businessId,
      projectId: input.projectId || null,
      entityId: ref.id,
      message: `Added task “${data.title}”${projectName ? ` to ${projectName}` : ""}`,
    });
  });
  return ref.id;
}

/** Updates a task and keeps the progress counters on the old/new project in step, atomically. */
export async function updateTask(id: string, input: TaskInput): Promise<void> {
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(doc(db, "tasks", id));
    if (!snap.exists()) throw new Error("This task no longer exists.");
    const prev = fromDoc<Task>(snap);

    // A task stays with its business; it may move between that business's projects
    const businessId = prev.businessId;
    const nextProjectId = input.projectId || null;

    let projectName = prev.projectName;
    if (nextProjectId && nextProjectId !== prev.projectId) {
      const project = await tx.get(doc(db, "projects", nextProjectId));
      if (!project.exists()) throw new Error("The selected project no longer exists.");
      const p = project.data() as Project;
      if (p.businessId !== businessId) throw new Error("That project belongs to a different business.");
      projectName = p.name;
    }
    if (!nextProjectId) projectName = "";

    const data = taskPayload(input);
    const isDone = data.status === "completed";
    tx.update(snap.ref, {
      ...data,
      projectId: nextProjectId,
      projectName,
      completedAt: isDone ? input.completedAt ?? prev.completedAt ?? Timestamp.now() : null,
      updatedAt: serverTimestamp(),
    });

    // Counter deltas
    const before = counts(prev.status);
    const after = counts(data.status);
    if (prev.projectId && prev.projectId === nextProjectId) {
      const dt = after.total - before.total;
      const dd = after.done - before.done;
      if (dt || dd) tx.update(doc(db, "projects", nextProjectId), { taskTotal: increment(dt), taskDone: increment(dd) });
    } else {
      if (prev.projectId && (before.total || before.done)) {
        tx.update(doc(db, "projects", prev.projectId), { taskTotal: increment(-before.total), taskDone: increment(-before.done) });
      }
      if (nextProjectId && (after.total || after.done)) {
        tx.update(doc(db, "projects", nextProjectId), { taskTotal: increment(after.total), taskDone: increment(after.done) });
      }
    }

    logActivity(tx, {
      kind: "task",
      businessId,
      projectId: nextProjectId,
      entityId: id,
      message:
        prev.status !== data.status
          ? data.status === "completed"
            ? `Completed task “${data.title}”`
            : `Task “${data.title}” moved to ${STATUS_LABELS[data.status]}`
          : `Updated task “${data.title}”`,
    });
  });
}

export async function setTaskStatus(task: Task, status: TaskStatus): Promise<void> {
  if (task.status === status) return;
  await updateTask(task.id, { ...task, status, completedAt: status === "completed" ? Timestamp.now() : null });
}

export async function getTask(id: string): Promise<Task | null> {
  const snap = await getDoc(doc(db, "tasks", id));
  return snap.exists() ? fromDoc<Task>(snap) : null;
}

export type TaskDueFilter = "any" | "overdue" | "next7" | "next30";

export async function listTasks(opts: {
  businessId?: string;
  projectId?: string;
  status?: TaskStatus | "open" | "";
  priority?: Priority | "";
  due?: TaskDueFilter;
  search?: string;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
  pageSize?: number;
}): Promise<Page<Task>> {
  const size = opts.pageSize ?? 25;
  const term = clean(opts.search).toLowerCase();

  const statusMatches = (s: TaskStatus) =>
    !opts.status || (opts.status === "open" ? OPEN_TASK_STATUSES.includes(s) : s === opts.status);

  // Title search: prefix match on titleLower, then the other filters on the matches
  if (term) {
    const snap = await getDocs(
      query(tasksCol(), where("titleLower", ">=", term), where("titleLower", "<=", term + ""), orderBy("titleLower"), qLimit(60)),
    );
    const items = snap.docs
      .map((d) => fromDoc<Task>(d))
      .filter(
        (t) =>
          (!opts.businessId || t.businessId === opts.businessId) &&
          (!opts.projectId || t.projectId === opts.projectId) &&
          (!opts.priority || t.priority === opts.priority) &&
          statusMatches(t.status),
      );
    return { items, cursor: null, hasMore: false };
  }

  const c: QueryConstraint[] = [];
  if (opts.businessId) c.push(where("businessId", "==", opts.businessId));
  if (opts.projectId) c.push(where("projectId", "==", opts.projectId));
  if (opts.priority) c.push(where("priority", "==", opts.priority));

  const due = opts.due ?? "any";
  if (due !== "any") {
    // Deadline views only make sense for open work
    c.push(
      opts.status && opts.status !== "open" ? where("status", "==", opts.status) : where("status", "in", OPEN_TASK_STATUSES),
    );
    const today = Timestamp.fromDate(startOfToday());
    if (due === "overdue") c.push(where("dueDate", "<", today));
    else c.push(where("dueDate", ">=", today), where("dueDate", "<", Timestamp.fromDate(addDays(startOfToday(), due === "next7" ? 7 : 30))));
    c.push(orderBy("dueDate", "asc"));
  } else {
    if (opts.status === "open") c.push(where("status", "in", OPEN_TASK_STATUSES));
    else if (opts.status) c.push(where("status", "==", opts.status));
    c.push(orderBy("createdAt", "desc"));
  }
  return fetchPage<Task>(query(tasksCol(), ...c), opts.cursor ?? null, size);
}

/** Everything that needs attention now: overdue, due within 7 days, and blocked */
export async function listAttentionTasks(): Promise<{ overdue: Task[]; dueSoon: Task[]; blocked: Task[] }> {
  const [overdue, dueSoon, blocked] = await Promise.all([
    listTasks({ due: "overdue", pageSize: 50 }),
    listTasks({ due: "next7", pageSize: 50 }),
    listTasks({ status: "blocked", pageSize: 50 }),
  ]);
  return { overdue: overdue.items, dueSoon: dueSoon.items, blocked: blocked.items };
}

/* ═══ Activity ══════════════════════════════════════════════════════════ */

export async function listActivity(opts: { businessId?: string; projectId?: string; limit?: number } = {}): Promise<Activity[]> {
  const c: QueryConstraint[] = [];
  if (opts.businessId) c.push(where("businessId", "==", opts.businessId));
  if (opts.projectId) c.push(where("projectId", "==", opts.projectId));
  const snap = await getDocs(query(activityCol(), ...c, orderBy("at", "desc"), qLimit(opts.limit ?? 15)));
  return snap.docs.map((d) => fromDoc<Activity>(d));
}

/* ═══ Overview ══════════════════════════════════════════════════════════ */

export interface OverviewCounts {
  businesses: number;
  activeBusinesses: number;
  onboardingBusinesses: number;
  activeProjects: number;
  completedProjects: number;
  openTasks: number;
  overdueTasks: number;
  dueSoonTasks: number;
}

/** Eight aggregation (count) queries: billed per index entries read, not per document. */
export async function getOverviewCounts(): Promise<OverviewCounts> {
  const today = Timestamp.fromDate(startOfToday());
  const soon = Timestamp.fromDate(addDays(startOfToday(), 7));
  const [businesses, activeBusinesses, onboardingBusinesses, activeProjects, completedProjects, openTasks, overdueTasks, dueSoonTasks] =
    await Promise.all([
      countOf(query(businessesCol())),
      countOf(query(businessesCol(), where("status", "==", "active"))),
      countOf(query(businessesCol(), where("status", "==", "onboarding"))),
      countOf(query(projectsCol(), where("archived", "==", false), where("status", "==", "active"))),
      countOf(query(projectsCol(), where("status", "==", "completed"))),
      countOf(query(tasksCol(), where("status", "in", OPEN_TASK_STATUSES))),
      countOf(query(tasksCol(), where("status", "in", OPEN_TASK_STATUSES), where("dueDate", "<", today))),
      countOf(query(tasksCol(), where("status", "in", OPEN_TASK_STATUSES), where("dueDate", ">=", today), where("dueDate", "<", soon))),
    ]);
  return { businesses, activeBusinesses, onboardingBusinesses, activeProjects, completedProjects, openTasks, overdueTasks, dueSoonTasks };
}

export async function listRecentBusinesses(n = 5): Promise<Business[]> {
  const snap = await getDocs(query(businessesCol(), orderBy("createdAt", "desc"), qLimit(n)));
  return snap.docs.map((d) => fromDoc<Business>(d));
}

export async function listDelayedProjects(n = 8): Promise<Project[]> {
  return (await listProjects({ deadline: "overdue", pageSize: n })).items;
}

/* ═══ Reports (on demand) ═══════════════════════════════════════════════ */

export interface ReportData {
  businesses: Business[];
  projects: Project[];
  tasks: Task[];
  delivered: Project[];
  truncated: boolean;
}

const REPORT_LIMIT = 1000;

/**
 * Loads the records a report needs, once, when the admin runs it.
 * Projects and tasks are those created within the date range (and business, if set);
 * "delivered" are projects completed within the date range.
 */
export async function loadReportData(opts: { from: Timestamp; to: Timestamp; businessId?: string }): Promise<ReportData> {
  const byBusiness = opts.businessId ? [where("businessId", "==", opts.businessId)] : [];
  const created = [where("createdAt", ">=", opts.from), where("createdAt", "<=", opts.to), orderBy("createdAt", "asc"), qLimit(REPORT_LIMIT)];

  const [b, p, t, d] = await Promise.all([
    getDocs(query(businessesCol(), orderBy("nameLower"), qLimit(REPORT_LIMIT))),
    getDocs(query(projectsCol(), ...byBusiness, ...created)),
    getDocs(query(tasksCol(), ...byBusiness, ...created)),
    getDocs(
      query(
        projectsCol(),
        where("status", "==", "completed"),
        where("completedAt", ">=", opts.from),
        where("completedAt", "<=", opts.to),
        orderBy("completedAt", "desc"),
        qLimit(REPORT_LIMIT),
      ),
    ),
  ]);

  const delivered = d.docs.map((x) => fromDoc<Project>(x)).filter((x) => !opts.businessId || x.businessId === opts.businessId);
  return {
    businesses: b.docs.map((x) => fromDoc<Business>(x)),
    projects: p.docs.map((x) => fromDoc<Project>(x)),
    tasks: t.docs.map((x) => fromDoc<Task>(x)),
    delivered,
    truncated: p.size >= REPORT_LIMIT || t.size >= REPORT_LIMIT,
  };
}
