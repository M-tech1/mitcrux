"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { SectionHeading, GlowOrb } from "@/components/ui";
import { useReveal, useStagger } from "@/hooks/useGSAP";
import { cn } from "@/lib/utils";

function TestimonialCard({
  item,
  active,
}: {
  item: (typeof TESTIMONIALS)[number];
  active: boolean;
}) {
  return (
    <figure
      className={cn(
        "flex flex-col gap-6 p-7 transition-[opacity,border-color,box-shadow] duration-500",
        active ? "glass-panel !border-[var(--border-hover)]" : "card-surface opacity-75 hover:opacity-100"
      )}
    >
      <div className="flex items-center justify-between">
        <Quote className="w-7 h-7 text-brand-400/60 dark:text-cyan-300/50" aria-hidden="true" />
        <div className="flex gap-0.5" role="img" aria-label={`Rated ${item.rating} out of 5`}>
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
          ))}
        </div>
      </div>

      {/* Content */}
      <blockquote className="text-base leading-relaxed flex-1" style={{ color: "var(--text-primary)" }}>
        &ldquo;{item.content}&rdquo;
      </blockquote>

      {/* Author */}
      <figcaption className="flex items-center justify-between gap-3 pt-5 border-t border-[var(--border-card)]">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center font-display font-bold text-sm text-ice"
            aria-hidden="true"
          >
            {item.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{item.name}</p>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{item.role}</p>
          </div>
        </div>
      </figcaption>
      <span
        className="self-start text-xs font-medium px-2.5 py-1 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card-2)] -mt-2"
        style={{ color: "var(--text-accent)" }}
      >
        {item.service}
      </span>
    </figure>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const headerRef = useReveal<HTMLDivElement>({ y: 30 });
  const gridRef   = useStagger<HTMLDivElement>(":scope > figure", { stagger: 0.15 });

  const prev = () => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);

  return (
    <section className="relative section-y overflow-hidden" style={{ background: "var(--bg-section-tint)" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
      <GlowOrb color="cyan"  size="lg" className="right-[-10%] top-[-10%] opacity-[0.10]" />
      <GlowOrb color="brand" size="md" className="left-[-5%] bottom-0 opacity-[0.12]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-14 md:mb-16">
          <SectionHeading
            align="center"
            eyebrow="Social Proof"
            title="Trusted by builders &"
            accent="decision makers."
          />
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.id} item={t} active={i === active} />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            type="button"
            onClick={prev}
            aria-label="Highlight previous testimonial"
            className="w-11 h-11 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {TESTIMONIALS.map((t, i) => (
            <button
              type="button"
              key={t.id}
              onClick={() => setActive(i)}
              aria-label={`Highlight testimonial from ${t.name}`}
              aria-pressed={i === active}
              className="p-2 group"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  i === active ? "bg-cyan-400 w-6" : "w-1.5 bg-slate-500/50 group-hover:bg-slate-400"
                )}
              />
            </button>
          ))}
          <button
            type="button"
            onClick={next}
            aria-label="Highlight next testimonial"
            className="w-11 h-11 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
