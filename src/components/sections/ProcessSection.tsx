"use client";

import { useRef, useEffect } from "react";
import { SectionTag, GlowOrb } from "@/components/ui";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "A focused 30-minute conversation to understand your goals, constraints, and timeline. We come prepared with questions — you leave with clarity.",
    detail: "Free · No commitment · 24hr booking",
    accent: "#1a72d7",
  },
  {
    number: "02",
    title: "Proposal & Scope",
    description:
      "Within 48 hours you receive a tailored proposal: fixed scope, defined deliverables, clear timeline, and transparent pricing — nothing vague.",
    detail: "48hr turnaround · Fixed-price packages",
    accent: "#0ea5d4",
  },
  {
    number: "03",
    title: "Build Sprint",
    description:
      "We execute with AI-accelerated tooling. You receive weekly progress updates, a staging environment to review, and direct access to your project lead.",
    detail: "AI-native delivery · Weekly demos",
    accent: "#00b4d8",
  },
  {
    number: "04",
    title: "Launch & Hand Over",
    description:
      "Deployment, documentation, team training. You own everything — code, credentials, pipelines. We don't lock you in.",
    detail: "Full IP transfer · Ongoing support available",
    accent: "#22d3ee",
  },
] as const;

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;
      ctx = gsap.context(() => {
        // Stagger the step cards in
        gsap.fromTo(
          sectionRef.current!.querySelectorAll("[data-step]"),
          { y: 48, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.9,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );

        // Animate the connector line fill
        gsap.fromTo(
          sectionRef.current!.querySelector("[data-connector]"),
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.6,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      }, sectionRef);
    })();

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden" style={{ background: "var(--bg-card-2)" }}
    >
      {/* Subtle top / bottom rules */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

      <GlowOrb color="brand" size="xl" className="left-[-20%] top-0 opacity-[0.06]" />
      <GlowOrb color="cyan"  size="lg" className="right-[-10%] bottom-0 opacity-[0.05]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <SectionTag className="mb-4">How It Works</SectionTag>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl xl:text-6xl leading-tight tracking-tight" style={{ color: "var(--text-primary)" }}>
              From idea to live product —<br />
              <span className="text-gradient">no guesswork.</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed max-w-xs font-light md:text-right" style={{ color: "var(--text-secondary)" }}>
            A repeatable process refined across 120+ projects. Predictable, transparent, fast.
          </p>
        </div>

        {/* Steps — desktop horizontal timeline */}
        <div className="hidden lg:block relative mb-6">
          {/* Connector line */}
          <div className="absolute top-8 left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-white/5">
            <div
              data-connector
              className="absolute inset-0 h-px"
              style={{
                background: "linear-gradient(90deg, #1a72d7, #0ea5d4, #00b4d8, #22d3ee)",
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Steps — mobile vertical */}
        <div className="lg:hidden flex flex-col gap-0">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-5">
              {/* Left: number + line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-mono font-bold text-sm text-white border"
                  style={{
                    background: `${step.accent}20`,
                    borderColor: `${step.accent}50`,
                    color: step.accent,
                  }}
                >
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-px flex-1 my-2"
                    style={{ background: `linear-gradient(to bottom, ${step.accent}40, transparent)` }}
                  />
                )}
              </div>

              {/* Right: content */}
              <div
                data-step
                className="pb-10 flex-1"
              >
                <h3 className="font-display font-bold text-lg mb-2 leading-snug" style={{ color: "var(--text-primary)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed mb-3 font-light" style={{ color: "var(--text-secondary)" }}>
                  {step.description}
                </p>
                <span
                  className="text-2xs font-mono tracking-wide"
                  style={{ color: `${step.accent}99` }}
                >
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-16 p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-brand-500/15" style={{ background: "var(--bg-card)" }}>
          <div>
            <p className="font-display font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
              Ready to start your project?
            </p>
            <p className="text-sm font-light" style={{ color: "var(--text-secondary)" }}>
              Book a free discovery call — slots fill up fast.
            </p>
          </div>
          <a
            href="/contact"
            className="btn-primary px-7 py-3.5 shrink-0 group"
          >
            Book Discovery Call
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none" stroke="currentColor" strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Desktop step card ─────────────────────────────────────────────────────── */
function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  return (
    <div
      data-step
      className={cn(
        "group relative flex flex-col gap-5 p-6 rounded-2xl border",
        "transition-all duration-300",
        "transition-all duration-400",
        // Stagger vertical offset for editorial staircase feel
        index % 2 === 1 ? "mt-12" : ""
      )}
      style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* Number bubble */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm border shrink-0"
          style={{
            background: `${step.accent}18`,
            borderColor: `${step.accent}40`,
            color: step.accent,
          }}
        >
          {step.number}
        </div>
        {/* Connector dot */}
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: step.accent, boxShadow: `0 0 6px ${step.accent}` }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1">
        <h3 className="font-display font-bold text-lg leading-snug group-hover:text-gradient transition-all duration-300">
          {step.title}
        </h3>
        <p className="text-sm leading-relaxed font-light flex-1" style={{ color: "var(--text-secondary)" }}>
          {step.description}
        </p>
      </div>

      {/* Footer detail */}
      <div className="pt-4 border-t border-white/5">
        <span
          className="text-2xs font-mono tracking-wide"
          style={{ color: `${step.accent}80` }}
        >
          {step.detail}
        </span>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${step.accent}08, transparent 70%)` }}
      />
    </div>
  );
}
