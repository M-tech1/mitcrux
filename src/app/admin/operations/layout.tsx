"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { AdminHeader } from "@/components/admin/AdminUI";
import { AdminAccount } from "@/components/admin/AdminAccount";
import { ToastProvider } from "@/components/admin/ops/Toast";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/operations", label: "Overview", exact: true },
  { href: "/admin/operations/businesses", label: "Businesses" },
  { href: "/admin/operations/projects", label: "Projects" },
  { href: "/admin/operations/tasks", label: "Tasks" },
  { href: "/admin/operations/reports", label: "Reports" },
];

function OpsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Operations" className="border-b border-[var(--border-subtle)]">
      <ul className="max-w-7xl mx-auto px-5 sm:px-6 flex gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const active = t.exact ? pathname === t.href : pathname === t.href || pathname.startsWith(`${t.href}/`);
          return (
            <li key={t.href} className="shrink-0">
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative block px-3.5 py-3 text-sm font-medium transition-colors",
                  active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                {t.label}
                {active && <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-brand-400 to-cyan-300" aria-hidden="true" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ToastProvider>
        <div className="min-h-screen">
          <AdminHeader width="max-w-7xl" right={<AdminAccount />} />
          <OpsNav />
          <main className="max-w-7xl mx-auto px-5 sm:px-6 py-8 md:py-10">{children}</main>
        </div>
      </ToastProvider>
    </AuthGuard>
  );
}
