"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import {
  getSubmission,
  updateSubmissionStatus,
  deleteSubmission,
  ContactSubmission,
  SubmissionStatus,
} from "@/lib/firestore";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { SERVICES } from "@/lib/constants";
import { ArrowLeft, Mail, Trash2 } from "lucide-react";
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

const STATUS_OPTIONS: Array<{ value: SubmissionStatus; label: string; activeCls: string }> = [
  { value: "new",      label: "New",      activeCls: "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" },
  { value: "read",     label: "Read",     activeCls: "border-amber-500/50 text-amber-400 bg-amber-500/10" },
  { value: "replied",  label: "Replied",  activeCls: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" },
  { value: "archived", label: "Archived", activeCls: "border-slate-500/50 text-slate-400 bg-slate-500/10" },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function formatFullDate(ts: Timestamp | null) {
  if (!ts) return "Just now";
  return ts.toDate().toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

/* ── Detail content (rendered inside AuthGuard) ──────────────────────────── */

function DetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [loading, setLoading]       = useState(true);
  const [updating, setUpdating]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => {
    getSubmission(id).then((data) => {
      setSubmission(data);
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (status: SubmissionStatus) => {
    if (!submission || updating || submission.status === status) return;
    setUpdating(true);
    await updateSubmissionStatus(id, status);
    setSubmission((prev) => (prev ? { ...prev, status } : prev));
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await deleteSubmission(id);
    router.replace("/admin/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Submission not found.</p>
        <Link href="/admin/dashboard" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#080f1e]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={cn(
              "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50",
              confirmDelete
                ? "border-red-500/50 text-red-400 bg-red-500/10"
                : "border-white/10 text-slate-500 hover:text-red-400 hover:border-red-500/30"
            )}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deleting ? "Deleting…" : confirmDelete ? "Confirm delete?" : "Delete"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Timestamp */}
        <p className="text-slate-600 text-xs font-mono mb-6">{formatFullDate(submission.submittedAt)}</p>

        {/* Contact + Project info */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-600 text-xs font-mono tracking-widest uppercase mb-4">Contact</p>
            <div className="space-y-3">
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Name</p>
                <p className="text-white text-sm font-medium">{submission.name}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Email</p>
                <a
                  href={`mailto:${submission.email}`}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  {submission.email}
                </a>
              </div>
              {submission.company && (
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Company</p>
                  <p className="text-white text-sm">{submission.company}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-600 text-xs font-mono tracking-widest uppercase mb-4">Project</p>
            <div className="space-y-3">
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Service</p>
                <p className="text-white text-sm font-medium">
                  {SERVICE_MAP[submission.service] ?? submission.service}
                </p>
              </div>
              {submission.budget && (
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Budget</p>
                  <p className="text-white text-sm">
                    {BUDGET_LABELS[submission.budget] ?? submission.budget}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-4">
          <p className="text-slate-600 text-xs font-mono tracking-widest uppercase mb-4">Message</p>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{submission.message}</p>
        </div>

        {/* Status + actions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-slate-600 text-xs font-mono tracking-widest uppercase mb-4">Status & Actions</p>

          {/* Status pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {STATUS_OPTIONS.map(({ value, label, activeCls }) => (
              <button
                key={value}
                onClick={() => handleStatusChange(value)}
                disabled={updating}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm border font-mono transition-all disabled:opacity-50",
                  submission.status === value
                    ? activeCls
                    : "border-white/10 text-slate-600 hover:border-white/20 hover:text-slate-400"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Reply button */}
          <a
            href={`mailto:${submission.email}?subject=Re: Your Mitcrux Enquiry`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 hover:border-blue-500/50 transition-all text-sm font-medium"
          >
            <Mail className="w-4 h-4" />
            Reply via Email
          </a>
        </div>
      </main>
    </div>
  );
}

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <DetailContent id={params.id} />
    </AuthGuard>
  );
}
