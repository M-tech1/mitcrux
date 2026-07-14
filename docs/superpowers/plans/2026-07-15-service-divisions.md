# Service Divisions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize MitCrux's 10 existing services into 4 named divisions (MitCrux Digital Solutions, MitCrux Managed IT, MitCrux Business Support, Growth & Specialized), add a new "Business Support & Virtual Assistance" service, and restructure the `/services` page to group cards by division while leaving the homepage preview as a curated flat grid.

**Architecture:** All service/division data lives in `src/lib/constants.ts` (single source of truth, already consumed by 4 components). Add a `DIVISIONS` array and a `division` field per service. `ServicesSection.tsx` branches its rendering on the existing `preview` prop: `preview=true` keeps a flat grid (now curated one-per-division); `preview=false` (the `/services` page) renders division-grouped sections with anchor-pill navigation.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, lucide-react icons. No test runner in this repo — verification is `npx tsc --noEmit`, `npm run lint`, `npm run build`, and manual check via `npm run dev`.

## Global Constraints

- Division mapping (verbatim from spec):
  - `digital-solutions` → mvp-development, ai-agents, ai-automation
  - `managed-it` → networking, it-support
  - `business-support` → business-support (new)
  - `growth-specialized` → product-design, social-media, it-training, ai-consulting, smart-home
- New service `business-support` uses category `"Assist"` and icon `Headset` from `lucide-react`.
- New service packages: Starter VA $180/mo, Growth VA $380/mo, Business Support Pod $750/mo, Enterprise Support Team Custom (all "Ongoing" duration, matching existing package shape).
- `SERVICE_CATEGORIES` export is removed (only consumer, the flat filter bar, is removed).
- Existing `category` field and its per-card badge are untouched.
- `Footer.tsx` and `src/app/services/[slug]/page.tsx` require no changes — verify, don't edit.
- Copy string "Eight integrated service lines" (or its variants) must be updated everywhere it appears to reflect 4 divisions / 11 services.

---

### Task 1: Add `DIVISIONS` array and `division` field to `SERVICES`

**Files:**
- Modify: `src/lib/constants.ts:1-6` (icon imports), `src/lib/constants.ts:26-279` (SERVICES array + new DIVISIONS const), `src/lib/constants.ts:282` (remove SERVICE_CATEGORIES)

**Interfaces:**
- Produces: `DIVISIONS: { id: string; name: string; tagline: string; accent: string; icon: LucideIcon }[]` (exported), each `SERVICES[number].division: string` matching a `DIVISIONS[number].id`.
- Consumes: existing `SERVICES` shape (id, slug, category, icon, title, tagline, description, accent, features, packages) — new entry and new field must match exactly.

- [ ] **Step 1: Add new icon imports**

In `src/lib/constants.ts`, update the top import block:

```ts
import {
  Code2, Zap, Bot, Brain,
  ShieldCheck, Network, Home, GraduationCap,
  Palette, TrendingUp,
  Share2, Settings, Wrench, Lightbulb,
  Headset, Sparkles, Server, Users,
} from "lucide-react";
```

- [ ] **Step 2: Add the `DIVISIONS` const above `SERVICES`**

Insert immediately before the `/* ── Services ── */` comment (before line 26):

```ts
/* ── Divisions ───────────────────────────────────────────────────────────── */
export const DIVISIONS = [
  {
    id: "digital-solutions",
    name: "MitCrux Digital Solutions",
    tagline: "Custom software, mobile apps, websites, APIs, and AI integrations.",
    accent: "#1a72d7",
    icon: Code2,
  },
  {
    id: "managed-it",
    name: "MitCrux Managed IT",
    tagline: "Helpdesk, device management, networking, and always-on support.",
    accent: "#10b981",
    icon: Server,
  },
  {
    id: "business-support",
    name: "MitCrux Business Support",
    tagline: "Virtual assistants and admin support that scale with you.",
    accent: "#ec4899",
    icon: Users,
  },
  {
    id: "growth-specialized",
    name: "Growth & Specialized",
    tagline: "Design, social media, training, consulting, and smart infrastructure.",
    accent: "#a855f7",
    icon: Sparkles,
  },
] as const;
```

- [ ] **Step 3: Add `division` field to each existing service**

For each of the 10 existing entries in `SERVICES`, add a `division` field right after `category`. Example for the first entry (`mvp-development`, line ~31):

```ts
    id: "mvp-development",
    slug: "mvp-development",
    category: "Build",
    division: "digital-solutions",
    icon: Code2,
```

Apply the same pattern (`division` right after `category`) to all 10 entries using this mapping:

| id | division |
|---|---|
| `mvp-development` | `digital-solutions` |
| `ai-agents` | `digital-solutions` |
| `ai-automation` | `digital-solutions` |
| `social-media` | `growth-specialized` |
| `product-design` | `growth-specialized` |
| `networking` | `managed-it` |
| `smart-home` | `growth-specialized` |
| `it-training` | `growth-specialized` |
| `it-support` | `managed-it` |
| `ai-consulting` | `growth-specialized` |

- [ ] **Step 4: Add the new `business-support` service entry**

Insert as the last entry in `SERVICES`, right before the closing `] as const;` (after the `ai-consulting` entry, before line 279):

```ts
  {
    id: "business-support",
    slug: "business-support",
    category: "Assist",
    division: "business-support",
    icon: Headset,
    title: "Business Support & Virtual Assistance",
    tagline: "Your extended team, without the overhead.",
    description:
      "Technical and executive virtual assistants who handle customer support, inbox and calendar management, CRM administration, documentation, and research — so your core team can focus on growth.",
    accent: "#ec4899",
    features: [
      "Technical Virtual Assistants",
      "Executive Assistants",
      "Customer Support Reps",
      "Email & Calendar Management",
      "CRM Administration",
      "Documentation & SOPs",
      "Research & Data Support",
    ],
    packages: [
      { name: "Starter VA",              price: "$180/mo", duration: "Ongoing", desc: "20 hrs/month, core admin tasks" },
      { name: "Growth VA",               price: "$380/mo", duration: "Ongoing", desc: "40 hrs/month, dedicated assistant + CRM/calendar/email" },
      { name: "Business Support Pod",    price: "$750/mo", duration: "Ongoing", desc: "2 assistants (technical + executive) + customer support coverage" },
      { name: "Enterprise Support Team", price: "Custom",  duration: "Ongoing", desc: "Multi-person pod + dedicated account manager" },
    ],
  },
```

- [ ] **Step 5: Remove `SERVICE_CATEGORIES` export**

Delete this block (currently around line 281-282):

```ts
/* ── Service categories for filter ──────────────────────────────────────── */
export const SERVICE_CATEGORIES = ["All", "Build", "Automate", "Market", "Design", "Infrastructure", "IoT", "Learn", "Support", "Consult"] as const;
```

- [ ] **Step 6: Verify with the TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: no errors. (This will fail at this point because `ServicesSection.tsx` still imports `SERVICE_CATEGORIES` — that's expected; Task 2 fixes it. If you want a clean check here, temporarily confirm the error is only `SERVICE_CATEGORIES` related, e.g. `Module '"@/lib/constants"' has no exported member 'SERVICE_CATEGORIES'`.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/constants.ts
git commit -m "feat: add service divisions and Business Support service"
```

---

### Task 2: Restructure `ServicesSection.tsx` for division-grouped and curated-preview rendering

**Files:**
- Modify: `src/components/sections/ServicesSection.tsx` (full rewrite of the filter/grid logic; `ServiceCard` component stays as-is)

**Interfaces:**
- Consumes: `SERVICES` and `DIVISIONS` from `src/lib/constants.ts` (as produced in Task 1); `SERVICES[number].division` field; `DIVISIONS[number]` shape `{ id, name, tagline, accent, icon }`.
- Produces: `ServicesSection({ preview }: { preview?: boolean })` — same external signature, so `src/app/services/page.tsx`, `src/app/services/[slug]/page.tsx`, and the homepage caller keep working unmodified.

- [ ] **Step 1: Update the import line**

Replace:

```ts
import { SERVICES, SERVICE_CATEGORIES } from "@/lib/constants";
```

with:

```ts
import { SERVICES, DIVISIONS } from "@/lib/constants";
```

- [ ] **Step 2: Add a `SERVICE_IMAGES` entry for the new service**

In the `SERVICE_IMAGES` map (currently lines 13-24), add one more line (reuse a relevant Unsplash photo id — people/office themed):

```ts
  "business-support": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=75&auto=format&fit=crop",
```

- [ ] **Step 3: Replace `FilterTab` with a `DivisionPill` component**

Delete the `FilterTab` function entirely (lines ~176-195) — it becomes unused once Step 4 removes the category filter bar. Add this new component in its place:

```ts
/* ── Division pill (anchor nav) ────────────────────────────────────────── */
function DivisionPill({ division }: { division: (typeof DIVISIONS)[number] }) {
  const Icon = division.icon;
  return (
    <a
      href={`#${division.id}`}
      className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-mono font-medium tracking-wide border transition-all duration-250"
      style={{ color: division.accent, borderColor: `${division.accent}40`, background: `${division.accent}0d` }}
    >
      <Icon className="w-3.5 h-3.5" />
      {division.name}
    </a>
  );
}
```

- [ ] **Step 4: Rewrite the `ServicesSection` body**

Replace the entire `export function ServicesSection` block (currently lines 198-265) with:

```ts
/* ── Services Section ───────────────────────────────────────────────────── */
export function ServicesSection({ preview = false }: { preview?: boolean }) {
  const headerRef = useReveal<HTMLDivElement>({ y: 30 });
  const gridRef   = useStagger<HTMLDivElement>(":scope > a", { stagger: 0.1 });

  // Preview mode: curated flat grid, one representative service per division
  // (first match per division, in DIVISIONS order), filled to 6 with the
  // next unused services in SERVICES order.
  const curatedPreview = (() => {
    const picked: (typeof SERVICES)[number][] = [];
    for (const division of DIVISIONS) {
      const match = SERVICES.find((s) => s.division === division.id && !picked.includes(s));
      if (match) picked.push(match);
    }
    for (const s of SERVICES) {
      if (picked.length >= 6) break;
      if (!picked.includes(s)) picked.push(s);
    }
    return picked.slice(0, 6);
  })();

  return (
    <section id="services" className="relative py-28 overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <div className="absolute inset-0 dark:bg-grid-dark bg-grid-light opacity-30" aria-hidden="true" />
      <GlowOrb color="brand" size="xl" className="-left-48 top-1/4 opacity-[0.07] dark:opacity-[0.08]" />
      <GlowOrb color="cyan"  size="lg" className="-right-32 bottom-1/4 opacity-[0.05] dark:opacity-[0.06]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end gap-8 mb-12">
          <div className="flex-1">
            <SectionTag className="mb-4">Services</SectionTag>
            <h2
              className="font-display font-extrabold text-4xl md:text-5xl xl:text-6xl leading-tight tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Everything your business<br />
              <em className="not-italic text-gradient">needs to scale.</em>
            </h2>
          </div>
          <div className="md:max-w-xs">
            <p className="text-base leading-relaxed font-light" style={{ color: "var(--text-secondary)" }}>
              4 service divisions. One AI-powered partner. No handoffs, no gaps.
            </p>
          </div>
        </div>

        {preview ? (
          <>
            {/* Preview grid */}
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {curatedPreview.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>

            {/* View all CTA */}
            <div className="flex justify-center mt-12">
              <Link href="/services" className="btn-ghost px-8 py-3.5 group">
                Explore All Services
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Division pill nav */}
            <div className="flex flex-wrap gap-2 mb-16 sticky top-20 z-20 py-2">
              {DIVISIONS.map((division) => (
                <DivisionPill key={division.id} division={division} />
              ))}
            </div>

            {/* Division sections */}
            {DIVISIONS.map((division) => {
              const divisionServices = SERVICES.filter((s) => s.division === division.id);
              return (
                <div key={division.id} id={division.id} className="mb-20 scroll-mt-24">
                  <div className="mb-8">
                    <h3
                      className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {division.name}
                    </h3>
                    <p className="text-sm font-light" style={{ color: "var(--text-secondary)" }}>
                      {division.tagline}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {divisionServices.map((service, i) => (
                      <ServiceCard key={service.id} service={service} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Verify with the TypeScript compiler and linter**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors (warnings about unused vars would indicate a leftover reference — there should be none since `FilterTab` was deleted and `activeFilter`/`useState` import is no longer used).

- [ ] **Step 6: Remove now-unused `useState` import if flagged**

If lint/tsc flags `useState` as unused (it was only used for `activeFilter`), update the import line at the top of the file from:

```ts
import { useState } from "react";
```

to removing it entirely (delete the line) — confirm nothing else in the file still calls `useState`.

- [ ] **Step 7: Manually verify in the browser**

Run: `npm run dev`
Open `http://localhost:3000/services` — confirm:
- 4 division pill links appear at the top and each smoothly scrolls to its section.
- Each division section shows only its mapped services (Digital Solutions: 3 cards, Managed IT: 2 cards, Business Support: 1 card, Growth & Specialized: 5 cards).

Open `http://localhost:3000/` — confirm the homepage services preview still renders 6 cards, one of which is "Business Support & Virtual Assistance".

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/ServicesSection.tsx
git commit -m "feat: group services page by division, curate homepage preview"
```

---

### Task 3: Update "Eight integrated service lines" copy

**Files:**
- Modify: `src/app/services/page.tsx:7` (metadata description), `src/app/services/page.tsx:24` (hero sub-copy)

**Interfaces:**
- Consumes: none (static copy only).
- Produces: none (leaf task).

- [ ] **Step 1: Update the metadata description**

In `src/app/services/page.tsx`, change:

```ts
export const metadata: Metadata = {
  title: "Services — AI-Powered Digital Solutions",
  description: "Explore Mitcrux's full suite: Rapid MVPs, AI Agents, Automation, Social Media Management, Design, Networking, Smart Home, and IT Training.",
};
```

to:

```ts
export const metadata: Metadata = {
  title: "Services — AI-Powered Digital Solutions",
  description: "Explore Mitcrux's full suite across 4 divisions: Digital Solutions, Managed IT, Business Support, and Growth & Specialized services.",
};
```

- [ ] **Step 2: Update the hero sub-copy**

Change:

```tsx
          <p className="text-xl font-light leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Eight integrated service lines. All AI-accelerated. All delivered by one team.
          </p>
```

to:

```tsx
          <p className="text-xl font-light leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            4 service divisions. 11 specialties. All delivered by one team.
          </p>
```

- [ ] **Step 3: Search for any other stale count references**

Run: `grep -rn "integrated service lines\|Eight integrated" src/`
Expected: no remaining matches after Steps 1-2 (the `ServicesSection.tsx` occurrence was already replaced in Task 2 Step 4).

- [ ] **Step 4: Verify with the TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/services/page.tsx
git commit -m "docs: update service count copy to reflect 4 divisions"
```

---

### Task 4: Full build verification

**Files:** none (verification-only task)

**Interfaces:** none

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: build succeeds with no type or lint errors, and static params generate for all 11 services including `/services/business-support`.

- [ ] **Step 2: Spot-check the new service detail page**

Run: `npm run dev`, open `http://localhost:3000/services/business-support`
Expected: page renders with title "Business Support & Virtual Assistance", the `Assist` category badge, 7 feature bullets, and 4 pricing packages (Starter VA, Growth VA, Business Support Pod, Enterprise Support Team).

- [ ] **Step 3: Spot-check the footer and homepage are unaffected**

Confirm `Footer.tsx`'s "Services" column still lists 5 services and the "View all services" link still works — no code change needed here, this is a regression check.
