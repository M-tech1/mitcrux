# Mitcrux — AI-Powered Tech Agency Website

A professional Next.js 14 website for Mitcrux, built with TypeScript, TailwindCSS, and GSAP animations.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 3 + custom CSS properties
- **Animations**: GSAP 3 with ScrollTrigger (lazy-loaded)
- **Icons**: Lucide React
- **Fonts**: Syne (display) + DM Sans (body) via Google Fonts

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage (hybrid one-page + links)
│   ├── layout.tsx          # Root layout with Navbar + Footer
│   ├── services/
│   │   ├── page.tsx        # All services listing
│   │   └── [slug]/page.tsx # Individual service detail
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── work/page.tsx
│   ├── academy/page.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Scroll-aware, mobile-ready navbar
│   │   └── Footer.tsx      # Full footer with CTA banner
│   ├── sections/
│   │   ├── HeroSection.tsx       # GSAP-animated hero
│   │   ├── ServicesSection.tsx   # Filterable services grid
│   │   ├── AboutSection.tsx      # Company story + differentiators
│   │   ├── TestimonialsSection.tsx
│   │   └── ContactSection.tsx    # Contact form + info
│   ├── ui/
│   │   └── index.tsx       # Shared: SectionTag, GlowOrb, ServiceIcon, etc.
│   └── animations/         # (reserved for future animation components)
├── hooks/
│   └── useGSAP.ts          # GSAP hooks: useReveal, useStagger, useHeroTimeline, etc.
├── lib/
│   ├── constants.ts        # All data: services, stats, testimonials, nav
│   └── utils.ts            # cn(), slugify(), etc.
└── types/                  # (reserved for shared TypeScript types)
```

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Build for production

```bash
npm run build
npm run start
```

## Deployment

### Vercel (recommended)

```bash
npx vercel
```

Or connect the GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

### Self-hosted

```bash
npm run build
npm run start
```

## Customisation

### Adding a new service

Edit `src/lib/constants.ts` — add a new entry to the `SERVICES` array. The service will automatically appear in:
- Homepage services preview
- `/services` listing page
- `/services/[slug]` detail page (auto-generated via `generateStaticParams`)
- Footer services list
- Contact form service dropdown

### Changing brand colours

Edit `tailwind.config.ts` → `theme.extend.colors.brand` and `globals.css` → `:root` CSS variables.

### Updating content

All site content (services, stats, testimonials, nav links, tech stack) lives in `src/lib/constants.ts`.

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `brand-600` | `#1a56a0` | Primary brand blue |
| `brand-500` | `#1a72d7` | Action blue |
| `cyan-500` | `#00b4d8` | Accent cyan |
| `surface-950` | `#080f1e` | Page background |
| `surface-800` | `#0f1a2e` | Card background |

## Contact

- **Website**: https://mitcrux.com
- **Email**: info@mitcrux.com
- **WhatsApp**: +234 806 519 1675
