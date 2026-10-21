import { SERVICES } from "@/lib/constants";
import type { SubmissionStatus } from "@/lib/firestore";

/* ── Shared admin lookups (list + detail views) ─────────────────────────── */

const SERVICE_MAP: Record<string, string> = Object.fromEntries(SERVICES.map((s) => [s.id, s.title]));

const BUDGET_LABELS: Record<string, string> = {
  "under-500":   "Under $500",
  "500-2000":    "$500 – $2,000",
  "2000-10000":  "$2,000 – $10,000",
  "10000-50000": "$10,000 – $50,000",
  "50000+":      "$50,000+",
  "unsure":      "Not sure yet",
};

export const serviceLabel = (id: string) => SERVICE_MAP[id] ?? (id === "other" ? "Other / Not sure yet" : id);
export const budgetLabel = (id: string) => BUDGET_LABELS[id] ?? id;

/* Semantic status colours (separate from the brand accent) */
export const STATUS_META: Record<SubmissionStatus, { label: string; badge: string; dot: string }> = {
  new:      { label: "New",      badge: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",          dot: "bg-cyan-300" },
  read:     { label: "Read",     badge: "bg-amber-400/10 text-amber-300 border-amber-400/30",       dot: "bg-amber-300" },
  replied:  { label: "Replied",  badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30", dot: "bg-emerald-300" },
  archived: { label: "Archived", badge: "bg-slate-400/10 text-slate-300 border-slate-400/30",       dot: "bg-slate-400" },
};

export const STATUS_ORDER: SubmissionStatus[] = ["new", "read", "replied", "archived"];

const AVATAR_COLORS = ["#2563eb", "#0891b2", "#059669", "#7c3aed", "#d97706", "#dc2626", "#4f46e5", "#ea580c"];

export function getInitials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function getAvatarColor(name: string) {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}
