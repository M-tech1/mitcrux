# Firebase Contact Form + Admin Panel — Design Spec

**Date:** 2026-05-29  
**Project:** Mitcrux website  
**Scope:** Connect the contact form to Firestore; add a protected admin panel to manage submissions.

---

## 1. Overview

- The public contact form (`ContactSection`) writes submissions to Firestore instead of simulating a delay.
- A dedicated `/admin` route gives the single site admin a real-time view of all submissions with status tracking, reply, and delete actions.
- Access is protected by Firebase Authentication (email/password). One admin account is created manually in the Firebase console — there is no sign-up flow in the app.
- All Firebase work is client-side (Firebase JS SDK). No server API routes or Admin SDK are used.

---

## 2. Firebase Services

| Service | Purpose |
|---|---|
| **Firestore** | Stores contact form submissions |
| **Firebase Auth (email/password)** | Authenticates the single admin user |

The admin account is provisioned once in the Firebase console. The app has no registration page.

---

## 3. Data Model

**Collection:** `contacts`

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Submitter's full name |
| `email` | `string` | Submitter's email address |
| `company` | `string` | Optional — may be empty string |
| `service` | `string` | Service ID (e.g. `"mvp-development"`) |
| `budget` | `string` | Budget range key (e.g. `"500-2000"`) |
| `message` | `string` | Project details |
| `submittedAt` | `Timestamp` | Set server-side via `serverTimestamp()` |
| `status` | `"new" \| "read" \| "replied" \| "archived"` | Defaults to `"new"` on creation |

---

## 4. Firestore Security Rules

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

- Anyone can submit the contact form (create).
- Only an authenticated Firebase user can read, update, or delete submissions.

---

## 5. File Structure

### New files

```
.env.local                                    — Firebase config (NEXT_PUBLIC_* placeholders)
src/lib/firebase.ts                           — Initialises Firebase app; exports db + auth
src/lib/firestore.ts                          — Typed Firestore helpers + TypeScript types
src/hooks/useAuth.ts                          — onAuthStateChanged hook → { user, loading }
src/components/admin/AuthGuard.tsx            — Redirects to /admin/login if unauthenticated
src/app/admin/layout.tsx                      — Full-screen overlay layout (hides site navbar/footer)
src/app/admin/page.tsx                        — Redirects to /admin/login or /admin/dashboard
src/app/admin/login/page.tsx                  — Email + password login form
src/app/admin/dashboard/page.tsx              — Real-time submissions list
src/app/admin/dashboard/[id]/page.tsx         — Submission detail + actions
```

### Modified files

```
src/components/sections/ContactSection.tsx    — Replace setTimeout with Firestore write
```

---

## 6. Auth Flow

1. Admin visits `/admin` → redirected based on current auth state.
2. Unauthenticated → `/admin/login`. Authenticated → `/admin/dashboard`.
3. Login form calls `signInWithEmailAndPassword(auth, email, password)`.
   - Success → navigate to `/admin/dashboard`.
   - Failure → inline error: "Invalid credentials. Access denied."
4. Every protected page is wrapped in `AuthGuard`. While Firebase resolves auth state, a full-screen spinner is shown. If no user, redirect to `/admin/login`.
5. Logout calls `signOut(auth)` → Firebase clears session → redirect to `/admin/login`.
6. Firebase persists the session across page refreshes automatically (default `browserLocalPersistence`).

---

## 7. Admin UI

### 7.1 Login Page (`/admin/login`)

- Centered card on dark background matching site theme.
- Mitcrux logo at top.
- Email field + password field (with show/hide toggle).
- "Sign In" button — disabled + spinner while submitting.
- Inline error message on failed login.
- "← Back to website" link at bottom.

### 7.2 Dashboard (`/admin/dashboard`)

**Top bar:**
- Mitcrux logo (links to `/`)
- "Admin Dashboard" label
- Logged-in email address
- Logout button

**Stats row:** Five cards — Total · New · Read · Replied · Archived — derived from the live `onSnapshot` subscription. Counts update in real-time.

**Filter tabs:** All · New · Read · Replied · Archived — filters the list below without a new network request.

**Submission list:**
Each row contains:
- Colour-coded initials avatar (colour derived from name)
- Name (bold) + email (muted)
- Service name (mapped from service ID via `SERVICES` constant) + budget label
- Relative submitted date ("Today", "Yesterday", "3d ago", or formatted date)
- Status badge: cyan=New · amber=Read · green=Replied · slate=Archived
- "View" button → `/admin/dashboard/[id]`

Empty state shown when no submissions match the active filter.

### 7.3 Submission Detail (`/admin/dashboard/[id]`)

**Header:** Back link → dashboard · Delete button (archiving is handled via status pills below)

**Content:**
- Submitted timestamp (full date + time)
- Contact info card: name, email, company
- Project info card: service (human-readable title), budget (human-readable label)
- Message block (full text, preserves line breaks)

**Actions:**
- **Status pills** — four pill buttons (New / Read / Replied / Archived). Active state highlighted. Clicking a non-active pill calls `updateSubmissionStatus()` immediately.
- **Reply via Email** — renders as an `<a href="mailto:{email}">` button. Opens the system email client with the submitter's address pre-filled.
- **Delete** — two-step: first click shows "Confirm delete?", second click calls `deleteSubmission()` then navigates back to dashboard.

---

## 8. Contact Form Changes (`ContactSection.tsx`)

- Import `submitContactForm` from `@/lib/firestore`.
- Extend status type: `"idle" | "sending" | "sent" | "error"`.
- Replace `setTimeout` simulation with `await submitContactForm(form)` inside try/catch.
- On catch: set status to `"error"`.
- Add error UI state: icon + "Something went wrong. Please try again." + retry button that resets to `"idle"`.

---

## 9. Environment Variables

File: `.env.local` (gitignored)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

All values sourced from **Firebase console → Project settings → Your apps → SDK snippet**.

---

## 10. Helpers in `firestore.ts`

| Function | Signature | Purpose |
|---|---|---|
| `submitContactForm` | `(data: NewSubmission) => Promise<void>` | Public form write |
| `subscribeToSubmissions` | `(cb: (subs: ContactSubmission[]) => void) => () => void` | Real-time dashboard listener |
| `getSubmission` | `(id: string) => Promise<ContactSubmission \| null>` | Load single submission |
| `updateSubmissionStatus` | `(id: string, status: SubmissionStatus) => Promise<void>` | Status change |
| `deleteSubmission` | `(id: string) => Promise<void>` | Hard delete |

---

## 11. Admin Layout Override

`src/app/admin/layout.tsx` renders a `fixed inset-0 z-[100]` container that visually overrides the root layout's Navbar and Footer. This avoids restructuring the entire `app/` directory into route groups while keeping the admin panel visually isolated.
