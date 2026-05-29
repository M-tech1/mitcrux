"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import {
  subscribeToSubmissions,
  ContactSubmission,
  SubmissionStatus,
} from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { SERVICES } from "@/lib/constants";
import { LogOut, ChevronRight, Zap, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Lookup maps ─────────────────────────────────────────────────────────── */

const SERVICE_MAP = Object.fromEntries(SERVICES.map((s) => [s.id, s.title]));

const BUDGET_LABELS: Record<string, string> = {
  "under-500":   "Under $500",
  "500-2000":    "$500 – $2,000",
  "2000-10000":  "$2,000 – $10,000",
  "10000-50000": "$10,000 – $50,000",
  "50000+":      "$50,000+",
  "unsure":      "Not sure yet",
};

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; cls: string }> = {
  new:      { label: "New",      cls: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  read:     { label: "Read",     cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  replied:  { label: "Replied",  cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  archived: { label: "Archived", cls: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
};

const AVATAR_COLORS = [
  "#1a72d7", "#00b4d8", "#10b981", "#a855f7",
  "#f59e0b", "#ef4444", "#6366f1", "#f97316",
];

const FILTER_KEYS = ["all", "new", "read", "replied", "archived"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string) {
  return AVATAR_COLORS[(name.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
}

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
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    return subscribeToSubmissions((data) => {
      setSubmissions(data);
      setLoadingData(false);
    });
  }, []);

  const counts: Record<FilterKey, number> = {
    all:      submissions.length,
    new:      submissions.filter((s) => s.status === "new").length,
    read:     submissions.filter((s) => s.status === "read").length,
    replied:  submissions.filter((s) => s.status === "replied").length,
    archived: submissions.filter((s) => s.status === "archived").length,
  };

  const displayed =
    filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <div className="min-h-screen text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#080f1e]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm tracking-tight">
                <span className="text-white">MIT</span>
                <span className="text-cyan-400">CRUX</span>
              </span>
            </Link>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400 text-sm font-mono">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-xs hidden sm:block">{user?.email}</span>
            <button
              onClick={async () => { try { await signOut(auth); } catch {} }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {FILTER_KEYS.map((key) => (
            <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold text-white">{counts[key]}</p>
              <p className="text-slate-500 text-xs font-mono capitalize mt-0.5">
                {key === "all" ? "Total" : key}
              </p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {FILTER_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono border transition-all",
                filter === key
                  ? "bg-blue-600/80 text-white border-blue-500/50"
                  : "text-slate-500 border-transparent hover:border-white/10"
              )}
            >
              {key === "all" ? "All" : key.charAt(0).toUpperCase() + key.slice(1)}
              {key !== "all" && counts[key] > 0 && (
                <span className="ml-1.5 opacity-60">{counts[key]}</span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {loadingData ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Inbox className="w-10 h-10 text-slate-700" />
            <p className="text-slate-600 text-sm">
              No submissions{filter !== "all" ? ` with status "${filter}"` : ""}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map((sub) => {
              const { label, cls } = STATUS_CONFIG[sub.status];
              return (
                <Link
                  key={sub.id}
                  href={`/admin/dashboard/${sub.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: getAvatarColor(sub.name) }}
                  >
                    {getInitials(sub.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-white truncate">{sub.name}</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border font-mono shrink-0", cls)}>
                        {label}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs truncate">{sub.email}</p>
                    <p className="text-slate-600 text-xs mt-0.5 truncate">
                      {SERVICE_MAP[sub.service] ?? sub.service}
                      {sub.budget ? ` · ${BUDGET_LABELS[sub.budget] ?? sub.budget}` : ""}
                    </p>
                  </div>

                  {/* Date + arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-600 text-xs font-mono hidden sm:block">
                      {formatDate(sub.submittedAt)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
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
