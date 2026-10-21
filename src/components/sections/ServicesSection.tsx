"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SERVICES, DIVISIONS } from "@/lib/constants";
import { SectionHeading, ServiceIcon, GlowOrb } from "@/components/ui";
import { Mascot } from "@/components/ui/Mascot";
import { useReveal, useStagger } from "@/hooks/useGSAP";
import { useSpotlight } from "@/hooks/useSpotlight";

/* ── Compact service card ───────────────────────────────────────────────── */
function ServiceCard({ service }: { service: (typeof SERVICES)[number] }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      data-spotlight
      className="group glass-panel card-interactive spotlight flex flex-col gap-4 p-5"
    >
      {/* Icon + category + arrow */}
      <div className="flex items-start justify-between gap-3">
        <ServiceIcon icon={service.icon} accent={service.accent} size="md" />
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ color: "var(--text-accent)", background: `${service.accent}14`, borderColor: `${service.accent}33` }}
          >
            {service.category}
          </span>
          <span className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--glass-border)] bg-[var(--glass-bg)] transition-colors duration-300 group-hover:border-[var(--border-hover)]">
            <ArrowUpRight
              aria-hidden="true"
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: "var(--text-primary)" }}
            />
          </span>
        </div>
      </div>

      {/* Title + tagline */}
      <div>
        <h3
          className="font-display font-bold text-lg leading-snug tracking-tight mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {service.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {service.tagline}
        </p>
      </div>

      {/* Feature tags */}
      <ul className="flex flex-wrap gap-1.5 mt-auto" aria-label={`${service.title} highlights`}>
        {service.features.slice(0, 3).map((f) => (
          <li
            key={f}
            className="text-xs px-2.5 py-1 rounded-lg border"
            style={{ color: "var(--text-secondary)", background: "var(--bg-card-2)", borderColor: "var(--border-card)" }}
          >
            {f}
          </li>
        ))}
        {service.features.length > 3 && (
          <li className="text-xs px-1.5 py-1" style={{ color: "var(--text-muted)" }}>
            +{service.features.length - 3} more
          </li>
        )}
      </ul>
    </Link>
  );
}

/* ── Division pill (anchor nav) ────────────────────────────────────────── */
function DivisionPill({ division }: { division: (typeof DIVISIONS)[number] }) {
  const Icon = division.icon;
  return (
    <a
      href={`#${division.id}`}
      className="flex shrink-0 items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 hover:bg-[var(--bg-card)]"
      style={{ color: "var(--text-secondary)" }}
    >
      <Icon className="w-4 h-4" style={{ color: division.accent }} aria-hidden="true" />
      {division.name}
    </a>
  );
}

/* ── Card grid with reveal + spotlight ─────────────────────────────────── */
function ServiceGrid({ services }: { services: readonly (typeof SERVICES)[number][] }) {
  const revealRef = useStagger<HTMLDivElement>(":scope > a", { stagger: 0.08 });
  const spotlightRef = useSpotlight<HTMLDivElement>();

  return (
    <div ref={spotlightRef}>
      <div ref={revealRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

/* ── Services Section ───────────────────────────────────────────────────── */
export function ServicesSection({ preview = false }: { preview?: boolean }) {
  const headerRef = useReveal<HTMLDivElement>({ y: 30 });

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
    <section id="services" className="relative section-y overflow-hidden scroll-mt-16">
      <GlowOrb color="brand" size="xl" className="-left-48 top-1/4 opacity-[0.10]" />
      <GlowOrb color="cyan" size="lg" className="-right-32 bottom-0 opacity-[0.08]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        {/* Header, with the mascot pointing toward the cards */}
        <div ref={headerRef} className="relative mb-10 md:mb-12 lg:pr-44">
          <SectionHeading
            eyebrow="Services"
            title="Everything your business"
            accent="needs to scale."
            description="4 service divisions. One AI-powered partner. No handoffs, no gaps."
          />
          <Mascot pose="point" className="hidden lg:block absolute right-0 bottom-[-1.5rem] w-36 -scale-x-100" />
        </div>

        {preview ? (
          <>
            <ServiceGrid services={curatedPreview} />

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
            <div className="sticky top-20 z-20 mb-14">
              <nav
                aria-label="Service divisions"
                className="glass-panel !rounded-2xl p-1.5 flex gap-1 overflow-x-auto max-w-full w-fit"
              >
                {DIVISIONS.map((division) => (
                  <DivisionPill key={division.id} division={division} />
                ))}
              </nav>
            </div>

            {/* Division sections */}
            {DIVISIONS.map((division) => (
              <div key={division.id} id={division.id} className="mb-16 last:mb-0 scroll-mt-40">
                <div className="mb-6">
                  <h3
                    className="font-display font-bold text-h3 mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {division.name}
                  </h3>
                  <p className="text-base" style={{ color: "var(--text-secondary)" }}>
                    {division.tagline}
                  </p>
                </div>
                <ServiceGrid services={SERVICES.filter((s) => s.division === division.id)} />
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
