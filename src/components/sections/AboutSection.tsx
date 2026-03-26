"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionTag, GlowOrb, StatBadge } from "@/components/ui";
import { DIFFERENTIATORS, STATS, TECH_STACK } from "@/lib/constants";
import { useReveal, useStagger } from "@/hooks/useGSAP";
import { cn } from "@/lib/utils";

/* ── Differentiator card ────────────────────────────────────────────────── */
function DiffCard({ item }: { item: (typeof DIFFERENTIATORS)[number] }) {
  const Icon = item.icon;
  return (
    <div className={cn(
      "group relative flex gap-4 p-5 rounded-2xl border transition-all duration-350",
      "border-[var(--border-card)] bg-[var(--bg-card)]",
      "hover:border-brand-500/30 hover:shadow-brand-sm hover:bg-[var(--bg-card-hover)]"
    )}>
      <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/20 to-brand-500/10 border border-brand-500/20 flex items-center justify-center group-hover:from-brand-600/30 transition-all">
        <Icon className="w-4 h-4 text-brand-500" strokeWidth={1.8} />
      </div>
      <div>
        <h4 className="font-display font-bold text-sm mb-1.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </h4>
        <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-secondary)" }}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

/* ── Tech pills ─────────────────────────────────────────────────────────── */
function TechPills() {
  return (
    <div className="relative overflow-hidden py-3">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--bg-card-2)] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--bg-card-2)] to-transparent z-10" />
      <div className="flex gap-3 animate-marquee whitespace-nowrap">
        {[...TECH_STACK, ...TECH_STACK].map((t, i) => (
          <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 border border-[var(--border-card)] bg-[var(--bg-card)]" style={{ color: "var(--text-muted)" }}>
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

  return (
    <section id="about" className="relative py-28 overflow-hidden" style={{ background: "var(--bg-card-2)" }}>
      <GlowOrb color="brand" size="xl" className="right-[-15%] top-0 opacity-[0.06] dark:opacity-[0.07]" />
      <GlowOrb color="cyan"  size="md" className="left-[-5%]  bottom-0 opacity-[0.05] dark:opacity-[0.06]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ── Split intro ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-20 mb-24">

          {/* Left text */}
          <div ref={leftRef}>
            <SectionTag className="mb-6">About Mitcrux</SectionTag>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl xl:text-[3.4rem] leading-tight tracking-tight mb-8" style={{ color: "var(--text-primary)" }}>
              We don't just write code.
              <br />
              <em className="not-italic text-gradient">We engineer outcomes.</em>
            </h2>
            <div className="space-y-4 text-lg leading-relaxed font-light mb-8" style={{ color: "var(--text-secondary)" }}>
              <p>
                We’re more than just a software development company — we’re your digital transformation partner. 
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
                "AI-accelerated delivery — 60% faster than traditional agencies",
                "Fixed-scope packages — no surprise invoices, ever",
                "5+ years of engineering and product expertise",
                "Global quality. Africa-first pricing.",
              ].map((v, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 mt-1 shrink-0" strokeWidth={2} />
                  <span className="text-base font-light" style={{ color: "var(--text-secondary)" }}>{v}</span>
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
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent dark:from-brand-900/70" />
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
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-brand px-4 py-2 rounded-full text-xs font-mono font-medium whitespace-nowrap" style={{ color: "var(--brand-accent)" }}>
                ✦ Built to be · Delivered globally
              </div>
            </div>

            {/* Stats card */}
            <div className="relative rounded-2xl p-7 mt-6 border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>
              <div className="absolute inset-0 bg-grid-auto opacity-30" />
              <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-brand-500/8 blur-2xl" />
              <p className="font-mono text-2xs tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
                Impact in numbers
              </p>
              <div className="relative grid grid-cols-2 gap-6">
                {STATS.map((s, i) => (
                  <StatBadge key={i} value={s.value} label={s.label} />
                ))}
              </div>
            </div>

            {/* Mission block */}
            <div className="rounded-2xl p-6 border border-cyan-500/15 bg-cyan-500/4">
              <p className="font-mono text-2xs tracking-widest uppercase mb-3" style={{ color: "var(--brand-accent)" }}>
                Our Mission
              </p>
              <p className="text-base leading-relaxed font-light italic" style={{ color: "var(--text-secondary)" }}>
                "To empower businesses with intelligent, beautifully designed, and reliable digital
                solutions that inspire growth, simplify processes, and make a lasting impact."
              </p>
            </div>
          </div>
        </div>

        {/* ── Differentiators ─────────────────────────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <SectionTag className="mb-4">Why Mitcrux</SectionTag>
            <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight" style={{ color: "var(--text-primary)" }}>
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
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-card)", background: "var(--bg-card-2)" }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border-card)" }}>
            <p className="font-mono text-2xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Technology Stack</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tools we use to build your solutions</p>
          </div>
          <div className="py-2">
            <TechPills />
          </div>
        </div>
      </div>
    </section>
  );
}
