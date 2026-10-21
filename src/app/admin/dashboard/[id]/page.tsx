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
import { AdminHeader, Avatar, Spinner, StatusBadge } from "@/components/admin/AdminUI";
import { STATUS_META, STATUS_ORDER, budgetLabel, serviceLabel } from "@/components/admin/meta";
import { ArrowLeft, Mail, Trash2, AlertCircle, Building2, Wallet, Layers, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function formatFullDate(ts: Timestamp | null) {
  if (!ts) return "Just now";
  return ts.toDate().toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function DetailRow({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-brand-500/10 border border-[var(--glass-border)]">
        <Icon className="w-4 h-4 text-cyan-300" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
        <div className="text-sm font-medium break-words" style={{ color: "var(--text-primary)" }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Detail content (rendered inside AuthGuard) ──────────────────────────── */

function DetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [loading, setLoading]       = useState(true);
  const [loadError, setLoadError]   = useState(false);
  const [updating, setUpdating]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    getSubmission(id)
      .then((data) => {
        setSubmission(data);
      })
      .catch((err) => {
        console.error("Failed to load submission:", err);
        setLoadError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // A pending "Confirm delete?" quietly resets if not confirmed
  useEffect(() => {
    if (!confirmDelete || deleting) return;
    const t = setTimeout(() => setConfirmDelete(false), 4000);
    return () => clearTimeout(t);
  }, [confirmDelete, deleting]);

  const handleStatusChange = async (status: SubmissionStatus) => {
    if (!submission || updating || submission.status === status) return;
    setUpdating(true);
    setActionError(null);
    try {
      await updateSubmissionStatus(id, status);
      setSubmission((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      console.error("Failed to update status:", err);
      setActionError("Couldn't update the status. Check your connection and try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    setActionError(null);
    try {
      await deleteSubmission(id);
      router.replace("/admin/dashboard");
    } catch (err) {
      console.error("Failed to delete submission:", err);
      setActionError("Couldn't delete this enquiry. Check your connection and try again.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const backLink = (
    <Link
      href="/admin/dashboard"
      className="flex items-center gap-2 text-sm font-medium rounded-lg transition-colors hover:text-[var(--text-primary)]"
      style={{ color: "var(--text-secondary)" }}
    >
      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      All enquiries
    </Link>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner label="Loading enquiry" /></div>;
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        {loadError && <AlertCircle className="w-9 h-9 text-red-400" aria-hidden="true" />}
        <p style={{ color: "var(--text-secondary)" }}>
          {loadError
            ? "Couldn't load this enquiry. Your session may have expired; try reloading."
            : "This enquiry doesn't exist or has been deleted."}
        </p>
        {backLink}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        width="max-w-5xl"
        left={backLink}
        right={
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl border transition-colors disabled:opacity-50",
              confirmDelete
                ? "border-red-400/50 text-red-300 bg-red-500/15"
                : "border-[var(--glass-border)] bg-[var(--glass-bg)] hover:text-red-300 hover:border-red-400/40"
            )}
            style={confirmDelete ? undefined : { color: "var(--text-secondary)" }}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            {deleting ? "Deleting…" : confirmDelete ? "Click again to delete" : "Delete"}
          </button>
        }
      />

      <main className="max-w-5xl mx-auto px-5 sm:px-6 py-8 md:py-10">
        {/* Who + when */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Avatar name={submission.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-h1 text-2xl md:text-3xl tracking-tight break-words">{submission.name}</h1>
              <StatusBadge status={submission.status} />
            </div>
            <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <CalendarClock className="w-4 h-4" aria-hidden="true" />
              {formatFullDate(submission.submittedAt)}
            </p>
          </div>
        </div>

        {actionError && (
          <div role="alert" className="flex items-center gap-2 mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-400/30 text-sm text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            {actionError}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_20rem] gap-5 items-start">
          {/* Message: the main thing to read */}
          <section className="card-surface p-6 md:p-7" aria-labelledby="msg-h">
            <h2 id="msg-h" className="text-sm font-semibold mb-4" style={{ color: "var(--text-accent)" }}>Message</h2>
            <p className="text-[0.95rem] leading-relaxed whitespace-pre-wrap break-words" style={{ color: "var(--text-primary)" }}>
              {submission.message}
            </p>
          </section>

          {/* Side column */}
          <div className="space-y-5">
            <section className="card-surface p-6 space-y-4" aria-labelledby="contact-h">
              <h2 id="contact-h" className="text-sm font-semibold" style={{ color: "var(--text-accent)" }}>Contact</h2>
              <DetailRow icon={Mail} label="Email">
                <a href={`mailto:${submission.email}`} className="text-cyan-300 hover:underline underline-offset-4">
                  {submission.email}
                </a>
              </DetailRow>
              {submission.company && (
                <DetailRow icon={Building2} label="Company">{submission.company}</DetailRow>
              )}
              <DetailRow icon={Layers} label="Service">{serviceLabel(submission.service)}</DetailRow>
              {submission.budget && (
                <DetailRow icon={Wallet} label="Budget">{budgetLabel(submission.budget)}</DetailRow>
              )}
            </section>

            <section className="glass-panel p-6" aria-labelledby="status-h">
              <h2 id="status-h" className="text-sm font-semibold mb-4" style={{ color: "var(--text-accent)" }}>Status</h2>
              <div className="grid grid-cols-2 gap-2 mb-5" role="group" aria-label="Set status">
                {STATUS_ORDER.map((value) => {
                  const active = submission.status === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleStatusChange(value)}
                      disabled={updating}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50",
                        active
                          ? STATUS_META[value].badge
                          : "border-[var(--border-card)] hover:border-white/20"
                      )}
                      style={active ? undefined : { color: "var(--text-secondary)" }}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_META[value].dot)} aria-hidden="true" />
                      {STATUS_META[value].label}
                    </button>
                  );
                })}
              </div>
              <a
                href={`mailto:${submission.email}?subject=Re: Your Mitcrux Enquiry`}
                className="btn-primary w-full justify-center"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                Reply via email
              </a>
            </section>
          </div>
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
