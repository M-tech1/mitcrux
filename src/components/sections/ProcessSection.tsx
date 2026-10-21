"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading, GlowOrb } from "@/components/ui";
import { Mascot } from "@/components/ui/Mascot";
import { prefersReducedMotion } from "@/hooks/useGSAP";

const STEPS = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "A focused 30-minute conversation to understand your goals, constraints, and timeline. We come prepared with questions; you leave with clarity.",
    detail: "Free · No commitment · 24hr booking",
    accent: "#1a72d7",
  },
  {
    number: "02",
    title: "Proposal & Scope",
    description:
      "Within 48 hours you receive a tailored proposal: fixed scope, defined deliverables, clear timeline, and transparent pricing, nothing vague.",
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
      "Deployment, documentation, team training. You own everything: code, credentials, pipelines. We don't lock you in.",
    detail: "Full IP transfer · Ongoing support available",
    accent: "#22d3ee",
  },
] as const;

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (cancelled || !sectionRef.current) return;
      ctx = gsap.context(() => {
        // Stagger the step cards in
        gsap.fromTo(
          sectionRef.current!.querySelectorAll("[data-step]"),
          { y: 48, opacity: 0, transition: "none" },
          {
            y: 0, opacity: 1,
            duration: 0.9,
            stagger: 0.18,
            ease: "power3.out",
            clearProps: "transform,transition",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );

        // Draw each connector segment in sequence, following the step reveal
        gsap.fromTo(
          sectionRef.current!.querySelectorAll("[data-connector]"),
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.6,
            stagger: 0.18,
            delay: 0.3,
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

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-y overflow-hidden"
    >
      <GlowOrb color="brand" size="xl" className="left-[-20%] top-0 opacity-[0.10]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <SectionHeading
          className="mb-16 md:mb-20"
          eyebrow="How It Works"
          title="From idea to live product"
          accent="no guesswork."
          description="A repeatable process refined across 120+ projects. Predictable, transparent, fast."
        />

        {/* Steps: 1 column on mobile, 2×2 on tablet, 4-up timeline on desktop */}
        <ol className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} isLast={i === STEPS.length - 1} />
          ))}
        </ol>

        {/* Bottom CTA strip */}
        <div className="relative mt-16 p-8 md:p-10 glass-panel overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/15 via-transparent to-cyan-300/10 pointer-events-none" aria-hidden="true" />
          <Mascot pose="wave" className="hidden sm:block relative w-24 md:w-28 shrink-0 -my-4" />
          <div className="relative sm:mr-auto">
            <p className="font-display font-bold text-xl md:text-2xl mb-1 tracking-tight" style={{ color: "var(--text-primary)" }}>
              Ready to start your project?
            </p>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              Book a free discovery call, slots fill up fast.
            </p>
          </div>
          <Link href="/contact" className="relative btn-primary px-7 py-3.5 shrink-0 group">
            Book Discovery Call
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Step: timeline marker above an equal-height card ────────────────────── */
function StepCard({
  step,
  isLast,
}: {
  step: (typeof STEPS)[number];
  isLast: boolean;
}) {
  return (
    <li data-step className="relative flex flex-col">
      {/* Timeline marker */}
      <div className="relative flex items-center gap-3 mb-5 h-10">
        <span
          className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm border shrink-0 bg-[var(--bg-page)]"
          style={{
            borderColor: `${step.accent}80`,
            color: "var(--text-accent)",
            boxShadow: `0 0 0 4px ${step.accent}14, 0 0 18px ${step.accent}33`,
          }}
        >
          {step.number}
        </span>
        {/* Desktop: segment running to the next step's marker (spans this column's remainder + the gap) */}
        {!isLast && (
          <span
            className="hidden lg:block absolute left-[3.25rem] -right-6 top-1/2 h-px bg-[var(--border-card)]"
            aria-hidden="true"
          >
            <span
              data-connector
              className="absolute inset-0"
              style={{ background: `linear-gradient(90deg, ${step.accent}, ${step.accent}33)` }}
            />
          </span>
        )}
      </div>

      {/* Card */}
      <div className="glass-panel flex flex-col flex-1 p-6">
        <h3 className="font-display font-bold text-lg leading-snug mb-3" style={{ color: "var(--text-primary)" }}>
          {step.title}
        </h3>
        <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
          {step.description}
        </p>
        <p
          className="mt-5 pt-4 border-t border-[var(--border-card)] text-xs font-medium"
          style={{ color: "var(--text-accent)" }}
        >
          {step.detail}
        </p>
      </div>
    </li>
  );
}
