# Service Divisions Design

## Goal

Reorganize MitCrux's existing services into 4 named divisions (3 flagships requested by the user + one catch-all) so the offering reads as a coherent, scalable portfolio instead of a flat list of 10 unrelated services. Implemented directly in the live site (`src/lib/constants.ts` + services UI), not just a planning doc.

## Division taxonomy & service mapping

New `DIVISIONS` array in `constants.ts`, each with `id`, `name`, `tagline`, `accent`, `icon`. Each entry in `SERVICES` gets a new `division: string` field (the division `id`) alongside its existing `category`.

| Division | id | Services |
|---|---|---|
| MitCrux Digital Solutions | `digital-solutions` | Rapid MVP & Software Development, AI Agent Frameworks, AI Automation & Integration |
| MitCrux Managed IT | `managed-it` | Networking & Infrastructure, IT Support & Maintenance |
| MitCrux Business Support | `business-support` | *(new)* Business Support & Virtual Assistance |
| Growth & Specialized | `growth-specialized` | Product Design & Branding, Social Media Management, Mitcrux Academy & IT Training, AI Consulting & Corporate Training, Smart Home & IoT |

Existing `category` field (Build/Automate/Market/.../Consult) is untouched and keeps showing as the per-card badge. `SERVICE_CATEGORIES` export is removed since its only consumer (the flat filter bar) goes away.

## New service: Business Support & Virtual Assistance

Added to `SERVICES` with the same shape as existing entries:

- `id` / `slug`: `business-support`
- `category`: `"Assist"` (new category label)
- `icon`: `Headset` (new lucide-react import)
- `title`: "Business Support & Virtual Assistance"
- `tagline`: "Your extended team, without the overhead."
- `description`: covers technical & executive virtual assistance, customer support coverage, and CRM/email/calendar/documentation admin for growing businesses.
- `features`: Technical Virtual Assistants, Executive Assistants, Customer Support Reps, Email & Calendar Management, CRM Administration, Documentation & SOPs, Research & Data Support
- `packages` (calibrated to existing pricing scale, e.g. IT Support's $80–$500/mo range):
  - Starter VA — $180/mo — Ongoing — 20 hrs/month, core admin tasks
  - Growth VA — $380/mo — Ongoing — 40 hrs/month, dedicated assistant, CRM + calendar + email
  - Business Support Pod — $750/mo — Ongoing — 2 assistants (technical + executive) + customer support coverage
  - Enterprise Support Team — Custom — Ongoing — Multi-person pod + dedicated account manager

## UI changes

### `/services` full page (`ServicesSection` with `preview={false}`)

- Remove the flat category filter bar (`SERVICE_CATEGORIES` tabs).
- Add a sticky row of 4 division pills at the top — anchor links (`#digital-solutions`, `#managed-it`, `#business-support`, `#growth-specialized`) that smooth-scroll to each section.
- Render 4 sections in division order, each with: heading (division name), one-line tagline, and a grid containing only that division's service cards (existing `ServiceCard` component, unchanged).
- Update hero copy in `src/app/services/page.tsx` and its `metadata.description` from "Eight integrated service lines" to reflect the new structure (4 divisions, 11 services).

### Homepage preview (`ServicesSection` with `preview={true}`)

- Change card selection from `SERVICES.slice(0, 6)` to a curated pick: one representative service per division (4 picks) plus 2 more high-priority services to fill 6 slots, instead of raw array order.
- Update the "Eight integrated service lines" sub-copy on the homepage section header to match the new count/structure.

### Untouched

- `Footer.tsx` — keeps showing its first-5 services list as-is.
- `src/app/services/[slug]/page.tsx` — keeps showing `service.category` as its badge; no division-specific UI needed there.

## Out of scope

- No changes to pricing/packages of existing services.
- No nav-level changes (top nav still links to `/services`, not to individual divisions).
- No changes to `/academy` or other standalone pages.
