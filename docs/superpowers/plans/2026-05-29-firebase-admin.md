# Firebase Contact Form + Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the Mitcrux contact form to Firestore and build a protected `/admin` panel for managing submissions with status tracking, reply, and delete.

**Architecture:** All Firebase work is client-side using the Firebase JS SDK. Firestore stores submissions; Firebase Auth (email/password) protects the admin panel. An `AuthGuard` component wraps every protected page and redirects unauthenticated users to `/admin/login`. The admin layout uses `fixed inset-0 z-[100]` to overlay the site's existing Navbar and Footer without restructuring the `app/` directory.

**Tech Stack:** Firebase JS SDK v10 (`firebase` npm package), Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React icons.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/lib/firebase.ts` | Initialise Firebase app; export `db` and `auth` |
| Create | `src/lib/firestore.ts` | Typed Firestore helpers + `ContactSubmission` types |
| Create | `src/hooks/useAuth.ts` | `onAuthStateChanged` hook → `{ user, loading }` |
| Create | `src/components/admin/AuthGuard.tsx` | Redirect to `/admin/login` when unauthenticated |
| Create | `src/app/admin/layout.tsx` | Full-screen overlay; hides site Navbar/Footer |
| Create | `src/app/admin/page.tsx` | Redirect root to login or dashboard based on auth |
| Create | `src/app/admin/login/page.tsx` | Email + password login form |
| Create | `src/app/admin/dashboard/page.tsx` | Real-time submissions list with stats + filter |
| Create | `src/app/admin/dashboard/[id]/page.tsx` | Submission detail, status pills, reply, delete |
| Create | `.env.local` | Firebase config placeholders (gitignored) |
| Modify | `src/components/sections/ContactSection.tsx` | Replace `setTimeout` with Firestore write |

---

## Task 1: Install Firebase and create environment variables

**Files:**
- Run: `npm install firebase`
- Create: `.env.local`

- [ ] **Step 1: Install the Firebase JS SDK**

```bash
npm install firebase
```

Expected output: `added N packages` with `firebase` listed. No errors.

- [ ] **Step 2: Create `.env.local` with placeholder keys**

Create the file `.env.local` in the project root with this content:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Fill in the values from: **Firebase console → Project settings → Your apps → Web app → SDK snippet (Config)**.

- [ ] **Step 3: Verify `.env.local` is gitignored**

```bash
git check-ignore -v .env.local
```

Expected output: `.gitignore:...  .env.local`. If it is not ignored, add `.env.local` to `.gitignore`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install firebase SDK"
```

---

## Task 2: Firebase initialisation (`src/lib/firebase.ts`)

**Files:**
- Create: `src/lib/firebase.ts`

- [ ] **Step 1: Create the file**

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/firebase.ts
git commit -m "feat: add Firebase initialisation"
```

---

## Task 3: Firestore helpers (`src/lib/firestore.ts`)

**Files:**
- Create: `src/lib/firestore.ts`

- [ ] **Step 1: Create the file**

Create `src/lib/firestore.ts`:

```typescript
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type SubmissionStatus = "new" | "read" | "replied" | "archived";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  submittedAt: Timestamp | null;
  status: SubmissionStatus;
}

export type NewSubmission = Omit<ContactSubmission, "id" | "submittedAt" | "status">;

export async function submitContactForm(data: NewSubmission): Promise<void> {
  await addDoc(collection(db, "contacts"), {
    ...data,
    status: "new" as SubmissionStatus,
    submittedAt: serverTimestamp(),
  });
}

export function subscribeToSubmissions(
  callback: (submissions: ContactSubmission[]) => void
): () => void {
  const q = query(collection(db, "contacts"), orderBy("submittedAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission)));
  });
}

export async function getSubmission(id: string): Promise<ContactSubmission | null> {
  const snap = await getDoc(doc(db, "contacts", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ContactSubmission;
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus
): Promise<void> {
  await updateDoc(doc(db, "contacts", id), { status });
}

export async function deleteSubmission(id: string): Promise<void> {
  await deleteDoc(doc(db, "contacts", id));
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/firestore.ts
git commit -m "feat: add Firestore helpers and ContactSubmission types"
```

---

## Task 4: Auth hook (`src/hooks/useAuth.ts`)

**Files:**
- Create: `src/hooks/useAuth.ts`

- [ ] **Step 1: Create the file**

Create `src/hooks/useAuth.ts`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useAuth.ts
git commit -m "feat: add useAuth hook"
```

---

## Task 5: AuthGuard component (`src/components/admin/AuthGuard.tsx`)

**Files:**
- Create: `src/components/admin/AuthGuard.tsx`

- [ ] **Step 1: Create the file**

Create `src/components/admin/AuthGuard.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080f1e]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/AuthGuard.tsx
git commit -m "feat: add AuthGuard component"
```

---

## Task 6: Update contact form to write to Firestore

**Files:**
- Modify: `src/components/sections/ContactSection.tsx`

- [ ] **Step 1: Add imports**

At the top of `src/components/sections/ContactSection.tsx`, the existing lucide import line is:

```tsx
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";
```

Replace it with:

```tsx
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { submitContactForm } from "@/lib/firestore";
```

- [ ] **Step 2: Extend the status type and update handleSubmit**

Find this block inside `ContactForm`:

```tsx
const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
```

Replace with:

```tsx
const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
```

Find the `handleSubmit` function:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("sending");
  // Simulate submission
  await new Promise((r) => setTimeout(r, 1800));
  setStatus("sent");
};
```

Replace with:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("sending");
  try {
    await submitContactForm(form);
    setStatus("sent");
  } catch {
    setStatus("error");
  }
};
```

- [ ] **Step 3: Add error state UI**

Inside `ContactForm`, the existing early-return for `status === "sent"` starts at line ~75. Add an error-state early-return **immediately after** the `status === "sent"` block (before the `return <form ...>`):

```tsx
if (status === "error") {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <div>
        <h3
          className="font-display font-bold text-2xl mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Something went wrong.
        </h3>
        <p className="text-base max-w-sm" style={{ color: "var(--text-secondary)" }}>
          We couldn't send your message. Please try again or reach us directly on WhatsApp.
        </p>
      </div>
      <button
        onClick={() => setStatus("idle")}
        className="btn-ghost px-6 py-2.5 text-sm"
      >
        Try again
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ContactSection.tsx
git commit -m "feat: connect contact form to Firestore"
```

---

## Task 7: Admin layout and root redirect

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Create the admin layout**

Create `src/app/admin/layout.tsx`:

```tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#080f1e] overflow-y-auto">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create the root admin redirect page**

Create `src/app/admin/page.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminRootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? "/admin/dashboard" : "/admin/login");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/layout.tsx src/app/admin/page.tsx
git commit -m "feat: add admin layout and root redirect"
```

---

## Task 8: Login page (`src/app/admin/login/page.tsx`)

**Files:**
- Create: `src/app/admin/login/page.tsx`

- [ ] **Step 1: Create the file**

Create `src/app/admin/login/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Zap } from "lucide-react";

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin/dashboard");
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/dashboard");
    } catch {
      setError("Invalid credentials. Access denied.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-2xl tracking-tight">
              <span className="text-white">MIT</span>
              <span className="text-cyan-400">CRUX</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-white font-bold text-2xl">Admin Access</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to manage submissions</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono tracking-widest uppercase">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mitcrux.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 text-xs font-mono tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          <Link href="/" className="hover:text-slate-500 transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/login/page.tsx
git commit -m "feat: add admin login page"
```

---

## Task 9: Dashboard page (`src/app/admin/dashboard/page.tsx`)

**Files:**
- Create: `src/app/admin/dashboard/page.tsx`

- [ ] **Step 1: Create the file**

Create `src/app/admin/dashboard/page.tsx`:

```tsx
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
              onClick={() => signOut(auth)}
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/dashboard/page.tsx
git commit -m "feat: add admin dashboard with real-time submissions list"
```

---

## Task 10: Submission detail page (`src/app/admin/dashboard/[id]/page.tsx`)

**Files:**
- Create: `src/app/admin/dashboard/[id]/page.tsx`

- [ ] **Step 1: Create the file**

Create `src/app/admin/dashboard/[id]/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/dashboard/[id]/page.tsx
git commit -m "feat: add submission detail page with status, reply, and delete"
```

---

## Task 11: Configure Firestore security rules

This step is done in the **Firebase console**, not in code.

- [ ] **Step 1: Open the Firebase console**

Go to your Firebase project → **Firestore Database → Rules** tab.

- [ ] **Step 2: Replace the default rules with**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{docId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

- [ ] **Step 3: Click "Publish"**

The rules take effect immediately.

- [ ] **Step 4: Create the admin Firebase Auth user**

In the Firebase console → **Authentication → Users → Add user**.

Enter the email and password you will use to log in at `/admin/login`. This is the only admin account.

---

## Task 12: End-to-end smoke test

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test the contact form**

Navigate to `http://localhost:3000/contact`. Fill in all required fields and submit. Expected: success state ("Message received."). In Firestore console, verify a new document appeared in the `contacts` collection with `status: "new"`.

- [ ] **Step 3: Test admin login — wrong credentials**

Navigate to `http://localhost:3000/admin/login`. Enter wrong credentials. Expected: "Invalid credentials. Access denied." error message.

- [ ] **Step 4: Test admin login — correct credentials**

Enter the email and password created in Task 11 Step 4. Expected: redirect to `/admin/dashboard`, submission from Step 2 visible in the list.

- [ ] **Step 5: Test status update**

Click the submission row. On the detail page, click "Read" pill. Expected: pill highlights, change persists after page refresh.

- [ ] **Step 6: Test reply button**

Click "Reply via Email". Expected: system email client opens with the submitter's address pre-filled in the To field.

- [ ] **Step 7: Test delete**

Click "Delete". Expected: button text changes to "Confirm delete?". Click again. Expected: redirect to dashboard, submission no longer in the list.

- [ ] **Step 8: Test auth guard**

Log out (Logout button). Navigate to `http://localhost:3000/admin/dashboard` directly. Expected: redirect to `/admin/login`.

- [ ] **Step 9: Final commit**

```bash
git add .
git commit -m "feat: complete Firebase contact form + admin panel"
```
