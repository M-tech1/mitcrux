"use client";

import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

/* Signed-in email + log out, for the admin header */
export function AdminAccount() {
  const { user } = useAuth();
  return (
    <>
      <span className="text-sm hidden lg:block truncate max-w-[16rem]" style={{ color: "var(--text-muted)" }}>
        {user?.email}
      </span>
      <button
        type="button"
        onClick={async () => { try { await signOut(auth); } catch {} }}
        className="btn-ghost !px-3.5 !py-2 !min-h-0 !text-sm"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Log out</span>
      </button>
    </>
  );
}
