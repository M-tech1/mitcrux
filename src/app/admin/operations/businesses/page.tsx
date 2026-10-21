"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Search, X, ChevronRight } from "lucide-react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { SERVICES } from "@/lib/constants";
import { BUSINESS_STATUSES, STATUS_LABELS, describeError, listBusinesses, type Business, type BusinessStatus } from "@/lib/operations";
import { ErrorState, LoadingRows, PageTitle, StatusPill, formatDate, EmptyState } from "@/components/admin/ops/ui";
import { LoadMore } from "@/components/admin/ops/lists";
import { BusinessFormDialog } from "@/components/admin/ops/forms";
import { cn } from "@/lib/utils";

const SERVICE_TITLE = Object.fromEntries(SERVICES.map((s) => [s.id, s.title]));
type StatusFilter = "current" | BusinessStatus;

export default function BusinessesPage() {
  const router = useRouter();
  const [status, setStatus] = useState<StatusFilter>("current");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [items, setItems] = useState<Business[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Debounce search typing into a query term
  useEffect(() => {
    const t = setTimeout(() => setTerm(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = async (append: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const page = await listBusinesses({ status, search: term, cursor: append ? cursor : null });
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
  }, [status, term]);

  const filters: { key: StatusFilter; label: string }[] = [
    { key: "current", label: "All current" },
    ...BUSINESS_STATUSES.map((s) => ({ key: s as StatusFilter, label: STATUS_LABELS[s] })),
  ];

  return (
    <>
      <PageTitle
        title="Businesses"
        description="Every business Mitcrux works with. Archiving keeps all project and task history."
        actions={
          <button type="button" onClick={() => setRegisterOpen(true)} className="btn-primary !text-sm">
            <Building2 className="w-4 h-4" aria-hidden="true" /> Register business
          </button>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <div className="relative md:w-80">
          <label htmlFor="biz-search" className="sr-only">Search businesses by name</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
          <input
            id="biz-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="field !pl-10 !pr-10 !min-h-[40px] !py-2"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5" style={{ color: "var(--text-muted)" }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1 overflow-x-auto" role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatus(f.key)}
              aria-pressed={status === f.key}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                status === f.key ? "bg-[var(--bg-card)] border-[var(--border-hover)] text-[var(--text-primary)]" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface p-2 sm:p-3">
        {error ? (
          <ErrorState message={error} onRetry={() => load(false)} />
        ) : loading && !items.length ? (
          <div className="p-2"><LoadingRows /></div>
        ) : !items.length ? (
          <EmptyState>
            {term ? `No businesses match “${term}”.` : status === "current" ? "No businesses yet. Register the first one." : `No ${STATUS_LABELS[status as BusinessStatus].toLowerCase()} businesses.`}
          </EmptyState>
        ) : (
          <>
            {/* Header row (desktop) */}
            <div className="hidden md:grid grid-cols-[1.6fr_1fr_1.4fr_7rem_6rem_1rem] gap-4 px-3 py-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              <span>Business</span><span>Contact</span><span>Services</span><span>Onboarded</span><span>Status</span><span />
            </div>
            <ul className="divide-y divide-[var(--border-card)]">
              {items.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/admin/operations/businesses/${b.id}`}
                    className="group grid md:grid-cols-[1.6fr_1fr_1.4fr_7rem_6rem_1rem] items-center gap-x-4 gap-y-1.5 px-3 py-3 rounded-lg hover:bg-white/[0.03]"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold truncate group-hover:text-cyan-300 transition-colors">{b.name}</span>
                      <span className="block text-xs truncate" style={{ color: "var(--text-muted)" }}>{b.category}</span>
                    </span>
                    <span className="text-xs min-w-0 truncate" style={{ color: "var(--text-secondary)" }}>
                      {b.contactName || b.contactEmail || "—"}
                    </span>
                    <span className="text-xs min-w-0 truncate" style={{ color: "var(--text-secondary)" }}>
                      {b.services?.length ? b.services.map((s) => SERVICE_TITLE[s] ?? s).join(", ") : "—"}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{formatDate(b.onboardedAt)}</span>
                    <span><StatusPill status={b.status} /></span>
                    <ChevronRight className="hidden md:block w-4 h-4" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <LoadMore hasMore={hasMore} loading={loading} onClick={() => load(true)} />
          </>
        )}
      </div>
      {term && <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>Search matches the start of business names.</p>}

      <BusinessFormDialog open={registerOpen} onOpenChange={setRegisterOpen} onSaved={(id) => router.push(`/admin/operations/businesses/${id}`)} />
    </>
  );
}
