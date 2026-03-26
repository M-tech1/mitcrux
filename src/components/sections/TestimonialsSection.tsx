"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { SectionTag, GlowOrb } from "@/components/ui";
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
    <div
      className={cn(
        "relative flex flex-col gap-6 p-8 rounded-2xl border transition-all duration-500",
        active
          ? "bg-gradient-to-br from-brand-900/50 to-surface-800 border-brand-500/25 shadow-brand-md scale-[1.02]"
          : "bg-surface-800/40 border-white/5 opacity-60 scale-[0.98]"
      )}
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-brand-500/40" />

      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>

      {/* Content */}
      <p className="text-lg leading-relaxed font-light flex-1 italic" style={{ color: "var(--text-primary)" }}>
        "{item.content}"
      </p>

      {/* Author */}
      <div className="flex items-center justify-between pt-4 border-t border-white/8">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-cyan-600 flex items-center justify-center font-display font-bold text-sm text-white">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-display font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.name}</p>
            <p className="text-slate-500 text-xs">{item.role}</p>
          </div>
        </div>
        <span className="text-2xs font-mono px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
          {item.service}
        </span>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const headerRef = useReveal<HTMLDivElement>({ y: 30 });
  const gridRef   = useStagger<HTMLDivElement>(":scope > div", { stagger: 0.15 });

  const prev = () => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
      <GlowOrb color="cyan"  size="lg" className="right-[-10%] top-[-10%] opacity-[0.07]" />
      <GlowOrb color="brand" size="md" className="left-[-5%]   bottom-0   opacity-[0.06]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <SectionTag className="mb-4">Social Proof</SectionTag>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight" style={{ color: "var(--text-primary)" }}>
            Trusted by builders &<br />
            <span className="text-gradient">decision makers.</span>
          </h2>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.id} item={t} active={i === active} />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-brand-500/40 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                i === active ? "bg-cyan-400 w-5" : "bg-slate-700 hover:bg-slate-500"
              )}
            />
          ))}
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-brand-500/40 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
