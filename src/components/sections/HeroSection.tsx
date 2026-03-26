"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useHeroTimeline } from "@/hooks/useGSAP";
import { SectionTag, GlowOrb } from "@/components/ui";
import { STATS, TECH_STACK } from "@/lib/constants";

/* ── Floating tech card ───────────────────────────────────────────────────── */
function TechCard({
  label,
  accent,
  delay,
  style,
}: {
  label: string;
  accent: string;
  delay: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute glass-brand rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-mono font-medium text-slate-300 dark:text-slate-300 animate-float shadow-brand-sm"
      style={{
        animationDelay: delay,
        border: `1px solid ${accent}40`,
        ...style,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse-slow"
        style={{ background: accent }}
      />
      {label}
    </div>
  );
}

/* ── Right visual panel ───────────────────────────────────────────────────── */

function HeroVisual() {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Central sphere */}
      <div className="relative">
        {/* Outer rings */}
        <div className="absolute inset-0 m-auto w-80 h-80 rounded-full border border-brand-500/10 animate-spin-slow" />
        <div
          className="absolute inset-0 m-auto w-64 h-64 rounded-full border border-cyan-500/15"
          style={{ animation: "spin 18s linear infinite reverse" }}
        />
        <div className="absolute inset-0 m-auto w-48 h-48 rounded-full border border-brand-500/20" />

        {/* Core orb */}
        <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center shadow-brand-xl animate-glow-pulse">
          {/* Inner gradient */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-500/30 to-cyan-500/20 blur-xl" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400/10 to-brand-400/20" />

          {/* Logo mark */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-display font-extrabold text-4xl tracking-tight text-white">
              MX
            </span>
            <span className="font-mono text-xs tracking-widest text-cyan-400/80 uppercase mt-1">
              Mitcrux
            </span>
          </div>
        </div>

        {/* Orbiting dots */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? "#1a72d7" : "#00b4d8",
              transform: `rotate(${deg}deg) translateX(140px) translateY(-50%)`,
              boxShadow: `0 0 8px ${i % 2 === 0 ? "#1a72d7" : "#00b4d8"}`,
            }}
          />
        ))}
      </div>

      {/* Floating cards */}
      <TechCard
        label="Next.js"
        accent="#1a72d7"
        delay="0s"
        style={{ top: "8%", left: "5%" } as React.CSSProperties}
      />
      <TechCard
        label="LangChain"
        accent="#00b4d8"
        delay="0.8s"
        style={{ top: "18%", right: "2%" } as React.CSSProperties}
      />
      <TechCard
        label="OpenAI GPT-4o"
        accent="#10b981"
        delay="1.6s"
        style={{ bottom: "22%", left: "2%" } as React.CSSProperties}
      />
      <TechCard
        label="Claude AI"
        accent="#a855f7"
        delay="2.4s"
        style={{ bottom: "8%", right: "8%" } as React.CSSProperties}
      />
      <TechCard
        label="n8n Agents"
        accent="#f59e0b"
        delay="0.4s"
        style={
          {
            top: "50%",
            left: "0%",
            transform: "translateY(-50%)",
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/* ── Scroll indicator ─────────────────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <div
      data-hero="scroll"
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
      onClick={() =>
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
      }
    >
      <span className="text-2xs font-mono tracking-widest uppercase text-slate-500 dark:text-slate-600 group-hover:text-slate-400 transition-colors">
        Scroll
      </span>
      <div className="w-5 h-8 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-brand-400 transition-colors flex items-start justify-center pt-1.5">
        <div className="w-1 h-2 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-cyan-400 transition-colors animate-bounce" />
      </div>
    </div>
  );
}

/* ── Main Hero ────────────────────────────────────────────────────────────── */
export function HeroSection() {
  const heroRef = useHeroTimeline<HTMLElement>();

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* ── Background: image in dark, gradient in light ── */}
      <div className="absolute inset-0 z-0">
        {/* Dark mode: full-bleed photo */}
        <div className="dark:block hidden absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&auto=format&fit=crop"
            alt="Technology background"
            fill
            className="object-cover opacity-25"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-950/90 to-brand-900/50" />
        </div>

        {/* Light mode: clean gradient mesh */}
        <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50/60 to-cyan-50/40" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 z-0 dark:bg-grid-dark bg-grid-light opacity-60"
        aria-hidden="true"
      />

      {/* Glow orbs */}
      <GlowOrb
        color="brand"
        size="xl"
        className="top-[-10%] left-[-5%] opacity-[0.15] dark:opacity-[0.12]"
      />
      <GlowOrb
        color="cyan"
        size="lg"
        className="bottom-[-5%] right-[-5%] opacity-[0.10] dark:opacity-[0.08]"
      />

      {/* Gradient fade at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg-page)] to-transparent z-[1] pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left: copy */}
          <div className="flex flex-col gap-8">
            <div data-hero="tag">
              <SectionTag>Creativity, Innovation & Technology</SectionTag>
            </div>

            <div className="flex flex-col gap-2">
              <h1
                data-hero="heading"
                className="font-display font-extrabold text-5xl md:text-6xl xl:text-7xl leading-[1.06] tracking-tight text-primary text-balance"
                style={{ color: "var(--text-primary)" }}
              >
                Build Fast.
              </h1>
              <h1
                data-hero="heading"
                className="font-display font-extrabold text-5xl md:text-6xl xl:text-7xl leading-[1.06] tracking-tight text-balance"
              >
                <em className="not-italic text-gradient">Build Smart.</em>
              </h1>
              <h1
                data-hero="heading"
                className="font-display font-extrabold text-5xl md:text-6xl xl:text-7xl leading-[1.06] tracking-tight text-balance"
                style={{ color: "var(--text-primary)" }}
              >
                Build with AI.
              </h1>
            </div>

            <p
              data-hero="sub"
              className="text-lg md:text-xl leading-relaxed max-w-xl font-light"
              style={{ color: "var(--text-secondary)" }}
            >
              Rapid MVPs, intelligent AI agents, automated workflows, and
              enterprise technological infrastructure.
            </p>

            <div data-hero="ctas" className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-primary text-base px-8 py-4 group"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/work"
                className="btn-ghost text-base px-8 py-4 group"
              >
                <Play className="w-4 h-4" />
                See Our Work
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-x-4 gap-y-6 pt-4 pb-8 border-t border-[var(--border-subtle)] ">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  data-hero="stat"
                  className="flex flex-col items-center"
                >
                  <span className="stat-number text-3xl">{s.value}</span>
                  <span
                    className="text-xs font-mono tracking-wider uppercase mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          <div
            data-hero="visual"
            className="relative hidden lg:flex h-[580px] items-center justify-center"
          >
            <HeroVisual />
          </div>
        </div>
        <ScrollIndicator />
      </div>

      {/* Tech marquee */}
      <div className=" overflow-hidden py-4 border-y border-[var(--border-subtle)] backdrop-blur-sm z-10">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {[...TECH_STACK, ...TECH_STACK].map((t, i) => (
            <span
              key={i}
              className="text-xs font-mono tracking-widest uppercase shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
