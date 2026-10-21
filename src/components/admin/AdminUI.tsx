"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { SubmissionStatus } from "@/lib/firestore";
import { cn } from "@/lib/utils";
import { STATUS_META, getAvatarColor, getInitials } from "@/components/admin/meta";
import logo from "../../../public/assets/logo.png";

/* ── Sticky admin top bar ───────────────────────────────────────────────── */
export function AdminHeader({
  left,
  right,
  width = "max-w-6xl",
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
  width?: string;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border-subtle)] bg-[var(--nav-bg)] backdrop-blur-xl">
      <div className={cn("mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-4", width)}>
        {left ?? <AdminBrand />}
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  );
}

const ADMIN_SECTIONS = [
  { href: "/admin/dashboard", label: "Enquiries" },
  { href: "/admin/operations", label: "Operations" },
] as const;

export function AdminBrand() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-3 sm:gap-5 min-w-0">
      <Link href="/" className="flex items-center gap-2 rounded-lg shrink-0" aria-label="Mitcrux website">
        <Image src={logo} alt="" sizes="32px" className="w-8 h-auto" />
        <span className="hidden md:inline font-display font-extrabold text-base tracking-tight">
          <span style={{ color: "var(--text-primary)" }}>MIT</span>
          <span className="text-gradient">CRUX</span>
        </span>
      </Link>
      <nav aria-label="Admin sections">
        <ul className="flex items-center gap-1 rounded-xl p-1 border border-[var(--glass-border)] bg-[var(--glass-bg)]">
          {ADMIN_SECTIONS.map((s) => {
            const active = pathname === s.href || pathname.startsWith(`${s.href}/`);
            return (
              <li key={s.href}>
                <Link
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-[var(--bg-card)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {s.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* ── Status badge ───────────────────────────────────────────────────────── */
export function StatusBadge({ status, className }: { status: SubmissionStatus; className?: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.new;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border shrink-0",
        meta.badge,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

/* ── Initials avatar ────────────────────────────────────────────────────── */
export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-display font-bold text-[#ffffff] shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
        size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-xs"
      )}
      style={{ background: getAvatarColor(name) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

export { Spinner } from "@/components/admin/Spinner";
