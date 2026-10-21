import Link from "next/link";
import { ArrowRight, ArrowDown, Play } from "lucide-react";
import { SectionTag } from "@/components/ui";
import { STATS, TECH_STACK } from "@/lib/constants";
import { HeroVisual } from "@/components/sections/HeroVisual";

/* Staggered CSS entrance delay */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/* ── Main Hero ────────────────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* ── Background: luminous planet-edge horizon arcing across the top ── */}
      <div className="horizon" aria-hidden="true" />

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-5 sm:px-6 pt-28 sm:pt-32 pb-12 lg:pt-36 lg:pb-14 w-full">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-10 xl:gap-16 items-center w-full">
          {/* Left: copy */}
          <div className="flex flex-col gap-7 lg:gap-8">
            <div className="anim-rise" style={d(0)}>
              <SectionTag>Creativity, Innovation &amp; Technology</SectionTag>
            </div>

            <h1 className="font-h1 text-display" style={{ color: "var(--text-primary)" }}>
              <span className="block anim-rise" style={d(80)}>Build Fast.</span>
              <span className="block anim-rise" style={d(160)}>
                <span className="text-gradient">Build Smart.</span>
              </span>
              <span className="block anim-rise" style={d(240)}>Build with AI.</span>
            </h1>

            <p className="anim-rise text-lead max-w-xl" style={{ ...d(320), color: "var(--text-secondary)" }}>
              Rapid MVPs, intelligent AI agents, automated workflows, and
              enterprise technological infrastructure.
            </p>

            <div className="anim-rise flex flex-col sm:flex-row gap-3 sm:gap-4" style={d(400)}>
              <Link href="/contact" className="btn-primary justify-center text-base px-8 py-4 group">
                Start a Project
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/work" className="btn-ghost justify-center text-base px-8 py-4">
                <Play className="w-4 h-4" />
                See Our Work
              </Link>
            </div>

            {/* Stats */}
            <dl
              className="anim-rise grid grid-cols-2 sm:grid-cols-4 gap-y-5 pt-7 mt-1 border-t border-[var(--border-subtle)]"
              style={d(480)}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col gap-1 pr-4 ${i > 0 ? "sm:pl-5 sm:border-l sm:border-[var(--border-subtle)]" : ""}`}
                >
                  <dt className="text-sm order-2" style={{ color: "var(--text-muted)" }}>
                    {s.label}
                  </dt>
                  <dd className="stat-number text-3xl leading-none order-1">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: 3D architectural visual */}
          <div className="anim-drift-in relative w-full max-w-[21rem] sm:max-w-md md:max-w-lg lg:max-w-none mx-auto" style={d(200)}>
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#services"
        className="relative z-10 hidden lg:flex mx-auto mb-6 items-center gap-2 text-xs rounded-full px-3 py-1.5 transition-colors hover:text-[var(--text-primary)]"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" aria-hidden="true" />
        Explore services
      </a>

      {/* Tech marquee */}
      <div className="relative z-10 overflow-hidden py-4 border-y border-[var(--border-subtle)] bg-[var(--glass-bg)] mask-fade-x">
        <p className="sr-only">Technologies we work with: {TECH_STACK.join(", ")}</p>
        <div className="flex gap-10 animate-marquee whitespace-nowrap w-max" aria-hidden="true">
          {[...TECH_STACK, ...TECH_STACK].map((t, i) => (
            <span key={i} className="text-sm font-medium shrink-0 flex items-center gap-10" style={{ color: "var(--text-muted)" }}>
              {t}
              <span className="w-1 h-1 rounded-full bg-cyan-300/50" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
