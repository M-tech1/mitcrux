"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { subscribeToSubmissions, ContactSubmission } from "@/lib/firestore";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { AdminHeader, Avatar, Spinner, StatusBadge } from "@/components/admin/AdminUI";
import { AdminAccount } from "@/components/admin/AdminAccount";
import { STATUS_META, STATUS_ORDER, budgetLabel, serviceLabel } from "@/components/admin/meta";
import { ChevronRight, Inbox, Search, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterKey = "all" | ContactSubmission["status"];
const FILTER_KEYS: FilterKey[] = ["all", ...STATUS_ORDER];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function formatDate(ts: Timestamp | null) {
  if (!ts) return "Just now";
  const diff = Math.floor((Date.now() - ts.toDate().getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff}d ago`;
  return ts.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ── Dashboard content (rendered inside AuthGuard) ───────────────────────── */

function DashboardContent() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [queryText, setQueryText] = useState("");

  useEffect(() => {
    return subscribeToSubmissions(
      (data) => {
        setSubmissions(data);
        setLoadError(false);
        setLoadingData(false);
      },
      () => {
        setLoadError(true);
        setLoadingData(false);
      }
    );
  }, []);

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: submissions.length, new: 0, read: 0, replied: 0, archived: 0 };
    for (const s of submissions) c[s.status] = (c[s.status] ?? 0) + 1;
    return c;
  }, [submissions]);

  const displayed = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    return submissions.filter((s) => {
      if (filter !== "all" && s.status !== filter) return false;
      if (!q) return true;
      return [s.name, s.email, s.company, serviceLabel(s.service), s.message]
        .some((field) => field?.toLowerCase().includes(q));
    });
  }, [submissions, filter, queryText]);

  return (
    <div className="min-h-screen">
      <AdminHeader right={<AdminAccount />} />

      <main className="max-w-6xl mx-auto px-5 sm:px-6 py-8 md:py-10">
        {/* Title */}
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <h1 className="font-h1 text-3xl md:text-4xl tracking-tight">Enquiries</h1>
            <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
              Contact form submissions, newest first.
            </p>
          </div>
          {!loadError && (
            <span className="inline-flex items-center gap-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              Live updates
            </span>
          )}
        </div>

        {/* Status tiles: counts that double as filters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6" role="group" aria-label="Filter by status">
          {FILTER_KEYS.map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={cn(
                  "card-surface text-left p-4 transition-[border-color,background-color] duration-200",
                  active ? "!border-[var(--border-hover)] !bg-[var(--bg-card-hover)]" : "hover:!border-white/15",
                  key === "all" && "col-span-2 sm:col-span-1"
                )}
              >
                <span className="block font-display font-extrabold text-2xl tabular-nums" style={{ color: "var(--text-primary)" }}>
                  {loadingData ? "–" : counts[key]}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {key !== "all" && <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_META[key].dot)} aria-hidden="true" />}
                  {key === "all" ? "Total" : STATUS_META[key].label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <label htmlFor="admin-search" className="sr-only">Search enquiries</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
          <input
            id="admin-search"
            type="search"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search by name, email, company, service or message"
            className="field !pl-10 !pr-10"
          />
          {queryText && (
            <button
              type="button"
              onClick={() => setQueryText("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* List */}
        {loadingData ? (
          <div className="py-20"><Spinner label="Loading enquiries" /></div>
        ) : loadError ? (
          <div role="alert" className="card-surface flex flex-col items-center gap-3 py-16 px-6 text-center">
            <AlertCircle className="w-9 h-9 text-red-400" aria-hidden="true" />
            <p className="font-semibold">Couldn&apos;t load enquiries.</p>
            <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
              Your session may have expired or this account may not have access. Reload the page, or log out and sign in again.
            </p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="card-surface flex flex-col items-center gap-3 py-16 px-6 text-center">
            <Inbox className="w-9 h-9" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {queryText
                ? `No enquiries match “${queryText.trim()}”${filter !== "all" ? ` in ${STATUS_META[filter].label}` : ""}.`
                : filter !== "all"
                  ? `No ${STATUS_META[filter].label.toLowerCase()} enquiries.`
                  : "No enquiries yet. New contact form submissions appear here automatically."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }} aria-live="polite">
              Showing {displayed.length} of {submissions.length}
            </p>
            <ul className="space-y-2">
              {displayed.map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/admin/dashboard/${sub.id}`}
                    className={cn(
                      "group card-surface flex items-center gap-4 p-4 transition-[border-color,background-color] duration-200 hover:!bg-[var(--bg-card-hover)] hover:!border-white/15",
                      sub.status === "new" && "!border-l-2 !border-l-cyan-300/70"
                    )}
                  >
                    <Avatar name={sub.name} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 min-w-0">
                        <p className={cn("text-sm truncate", sub.status === "new" ? "font-bold" : "font-semibold")}>
                          {sub.name}
                        </p>
                        <StatusBadge status={sub.status} />
                      </div>
                      <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                        {sub.email}
                        {sub.company ? ` · ${sub.company}` : ""}
                      </p>
                      <p className="text-xs mt-1 truncate" style={{ color: "var(--text-muted)" }}>
                        <span style={{ color: "var(--text-accent)" }}>{serviceLabel(sub.service)}</span>
                        {sub.budget ? ` · ${budgetLabel(sub.budget)}` : ""}
                        {sub.message ? ` · ${sub.message.replace(/\s+/g, " ")}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono hidden sm:block" style={{ color: "var(--text-muted)" }}>
                        {formatDate(sub.submittedAt)}
                      </span>
                      <ChevronRight
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        style={{ color: "var(--text-muted)" }}
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {submissions.length >= 100 && (
              <p className="text-xs mt-4 text-center" style={{ color: "var(--text-muted)" }}>
                Showing the 100 most recent enquiries.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
