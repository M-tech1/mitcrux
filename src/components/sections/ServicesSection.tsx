"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SERVICES, DIVISIONS } from "@/lib/constants";
import { SectionTag, ServiceIcon, GlowOrb } from "@/components/ui";
import { useReveal, useStagger } from "@/hooks/useGSAP";
import { cn } from "@/lib/utils";

/* ── Service images mapped by slug ─────────────────────────────────────── */
const SERVICE_IMAGES: Record<string, string> = {
  "mvp-development": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=75&auto=format&fit=crop",
  "ai-agents":       "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=75&auto=format&fit=crop",
  "ai-automation":   "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&q=75&auto=format&fit=crop",
  "social-media":    "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&q=75&auto=format&fit=crop",
  "product-design":  "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=75&auto=format&fit=crop",
  "networking":      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=75&auto=format&fit=crop",
  "smart-home":      "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=75&auto=format&fit=crop",
  "it-training":     "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=75&auto=format&fit=crop",
  "it-support":      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=75&auto=format&fit=crop",
  "ai-consulting":   "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=75&auto=format&fit=crop",
  "business-support": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=75&auto=format&fit=crop",
};

/* ── Service card ───────────────────────────────────────────────────────── */
function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const isLarge = index === 0 || index === 3;
  const img = SERVICE_IMAGES[service.slug];

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative rounded-2xl flex flex-col overflow-hidden cursor-pointer",
        "border transition-all duration-400",
        isLarge ? "md:col-span-2" : "md:col-span-1"
      )}
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-card)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Hover glow background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none z-0"
        style={{ background: `radial-gradient(ellipse at 20% 20%, ${service.accent}0c 0%, transparent 65%)` }}
      />
      {/* Hover border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none z-0"
        style={{ boxShadow: `inset 0 0 0 1px ${service.accent}40` }}
      />

      {/* Image strip — shown on all cards */}
      {img && (
        <div className={cn("relative w-full overflow-hidden shrink-0", isLarge ? "h-44" : "h-36")}>
          <Image
            src={img}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, transparent 30%, ${service.accent}22 100%)` }}
          />
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span
              className="text-2xs font-mono tracking-widest uppercase px-2.5 py-1 rounded-md border backdrop-blur-md"
              style={{ color: service.accent, background: `${service.accent}1a`, borderColor: `${service.accent}40` }}
            >
              {service.category}
            </span>
          </div>
          {/* Arrow indicator for small cards */}
          {!isLarge && (
            <div className="absolute top-4 right-4">
              <ArrowUpRight
                className="w-4 h-4 text-white/60 group-hover:text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
              />
            </div>
          )}
        </div>
      )}

      <div className="relative z-10 p-6 flex flex-col gap-4 flex-1">
        {/* Top row — only rendered as fallback when no image is available */}
        {!isLarge && !img && (
          <div className="flex items-center justify-between">
            <span
              className="text-2xs font-mono tracking-widest uppercase px-2.5 py-1 rounded-md border"
              style={{ color: service.accent, background: `${service.accent}15`, borderColor: `${service.accent}30` }}
            >
              {service.category}
            </span>
            <ArrowUpRight
              className="w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: "var(--text-muted)" }}
            />
          </div>
        )}

        {/* Icon + title */}
        <div className={cn("flex gap-4", isLarge ? "items-center" : "flex-col")}>
          <ServiceIcon icon={service.icon} accent={service.accent} size={isLarge ? "lg" : "md"} />
          <div>
            <h3
              className="font-display font-bold text-lg leading-snug mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {service.title}
            </h3>
            <p className="text-sm font-light" style={{ color: "var(--text-secondary)" }}>
              {service.tagline}
            </p>
          </div>
          {isLarge && (
            <ArrowUpRight
              className="ml-auto w-5 h-5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: "var(--text-muted)" }}
            />
          )}
        </div>

        {/* Description — large cards only */}
        {isLarge && (
          <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-secondary)" }}>
            {service.description}
          </p>
        )}

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {service.features.slice(0, isLarge ? 4 : 3).map((f, i) => (
            <span
              key={i}
              className="text-2xs px-2 py-1 rounded-md font-mono border"
              style={{ color: "var(--text-muted)", background: "var(--bg-card-2)", borderColor: "var(--border-card)" }}
            >
              {f}
            </span>
          ))}
          {service.features.length > (isLarge ? 4 : 3) && (
            <span className="text-2xs px-2 py-1 rounded-md font-mono" style={{ color: "var(--text-muted)" }}>
              +{service.features.length - (isLarge ? 4 : 3)} more
            </span>
          )}
        </div>

        {/* CTA */}
        <div
          className="flex items-center gap-1.5 text-sm font-medium mt-1 pt-4 border-t"
          style={{ borderColor: "var(--border-card)", color: `${service.accent}cc` }}
        >
          <span className="transition-colors duration-300 group-hover:text-cyan-500 dark:group-hover:text-white">
            Learn more
          </span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

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
