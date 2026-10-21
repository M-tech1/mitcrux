"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionTag, SectionHeading, StatBadge } from "@/components/ui";
import { DIFFERENTIATORS, STATS, TECH_STACK } from "@/lib/constants";
import { useReveal, useStagger } from "@/hooks/useGSAP";
import { useSpotlight } from "@/hooks/useSpotlight";
import { cn } from "@/lib/utils";

/* ── Differentiator card ────────────────────────────────────────────────── */
function DiffCard({ item }: { item: (typeof DIFFERENTIATORS)[number] }) {
  const Icon = item.icon;
  return (
    <div data-spotlight className={cn("group glass-panel spotlight flex gap-5 p-6")}>
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/25 to-cyan-300/10 border border-cyan-300/20 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <Icon className="w-5 h-5 text-brand-400 dark:text-cyan-300" strokeWidth={1.8} />
      </div>
      <div>
        <h4 className="font-display font-bold text-base mb-1.5" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

/* ── Tech pills ─────────────────────────────────────────────────────────── */
function TechPills() {
  return (
    <div className="relative overflow-hidden py-3 mask-fade-x">
      <p className="sr-only">{TECH_STACK.join(", ")}</p>
      <div className="flex gap-3 animate-marquee whitespace-nowrap w-max" aria-hidden="true">
        {[...TECH_STACK, ...TECH_STACK].map((t, i) => (
          <span key={i} className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm shrink-0 border border-[var(--border-card)] bg-[var(--bg-card)]" style={{ color: "var(--text-secondary)" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── About Section ──────────────────────────────────────────────────────── */
export function AboutSection() {
  const leftRef  = useReveal<HTMLDivElement>({ x: -40, y: 0 });
  const rightRef = useReveal<HTMLDivElement>({ x: 40,  y: 0 });
  const diffRef  = useStagger<HTMLDivElement>(":scope > div", { stagger: 0.12 });
  const spotlightRef = useSpotlight<HTMLDivElement>();

  return (
    <section id="about" className="relative section-y overflow-hidden" style={{ background: "var(--bg-section-tint)" }}>
      <div className="absolute inset-0 bg-ambient opacity-70" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        {/* ── Split intro ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 mb-20 md:mb-24">

          {/* Left text */}
          <div ref={leftRef}>
            <SectionHeading
              align="left"
              eyebrow="About Mitcrux"
              title="We don't just write code."
              accent="We engineer outcomes."
              className="mb-8"
            />
            <div className="space-y-4 text-lead mb-8" style={{ color: "var(--text-secondary)" }}>
              <p>
                We're more than just a software development company. We're your digital transformation partner.
                We specialize in crafting powerful, scalable, and intelligent solutions that help businesses operate smarter, faster, and more efficiently.
              </p>
              <p>
                We combine deep engineering craft with the most advanced AI development tools
                available today to deliver faster, smarter, and more cost-effective digital solutions
                than anyone else on the continent.
              </p>
            </div>

            <ul className="space-y-3 mb-10">
              {[
                "AI-accelerated delivery: 60% faster than traditional agencies",
                "Fixed-scope packages: no surprise invoices, ever",
                "5+ years of engineering and product expertise",
                "Global quality. Africa-first pricing.",
              ].map((v, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 dark:text-cyan-300 mt-0.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                  <span className="text-base" style={{ color: "var(--text-secondary)" }}>{v}</span>
                </li>
              ))}
            </ul>

            <Link href="/about" className="btn-primary px-7 py-3.5 group">
              Our Full Story
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Right: image collage + stats */}
          <div ref={rightRef} className="flex flex-col gap-5 justify-center">

            {/* Image collage */}
            <div className="relative grid grid-cols-2 gap-3 h-[280px]">
              {/* Main image */}
              <div className="relative col-span-1 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop"
                  alt="Team working together"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-brand-500/10" />
              </div>
              {/* Stack of 2 smaller images */}
              <div className="flex flex-col gap-3">
                <div className="relative flex-1 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80&auto=format&fit=crop"
                    alt="Modern tech office"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-brand-600/20 dark:bg-brand-600/30" />
                </div>
                <div className="relative flex-1 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80&auto=format&fit=crop"
                    alt="Engineer at workstation"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-brand-900/30 dark:bg-brand-900/50" />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-panel !rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap" style={{ color: "var(--text-accent)" }}>
                Built to be · Delivered globally
              </div>
            </div>

            {/* Stats card */}
            <div className="relative glass-panel p-7 mt-6 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-brand-500/15 blur-2xl" aria-hidden="true" />
              <p className="text-sm font-semibold mb-6" style={{ color: "var(--text-accent)" }}>
                Impact in numbers
              </p>
              <div className="relative grid grid-cols-2 gap-6">
                {STATS.map((s, i) => (
                  <StatBadge key={i} value={s.value} label={s.label} />
                ))}
              </div>
            </div>

            {/* Mission block */}
            <div className="card-surface p-6 border-l-2 !border-l-cyan-300/60">
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-accent)" }}>
                Our Mission
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                "To empower businesses with intelligent, beautifully designed, and reliable digital
                solutions that inspire growth, simplify processes, and make a lasting impact."
              </p>
            </div>
          </div>
        </div>

        {/* ── Differentiators ─────────────────────────────────────────── */}
        <div ref={spotlightRef} className="mb-20">
          <div className="text-center mb-10">
            <SectionTag className="mb-4">Why Mitcrux</SectionTag>
            <h3 className="font-display font-bold text-h3" style={{ color: "var(--text-primary)" }}>
              What makes us different
            </h3>
          </div>
          <div ref={diffRef} className="grid sm:grid-cols-2 gap-4">
            {DIFFERENTIATORS.map((item, i) => (
              <DiffCard key={i} item={item} />
            ))}
          </div>
        </div>

        {/* ── Tech stack strip ────────────────────────────────────────── */}
        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-4 border-b flex flex-wrap gap-2 items-center justify-between" style={{ borderColor: "var(--border-card)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Technology Stack</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tools we use to build your solutions</p>
          </div>
          <div className="py-2">
            <TechPills />
          </div>
        </div>
      </div>
    </section>
  );
}
