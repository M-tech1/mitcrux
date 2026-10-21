import Image from "next/image";
import { Code2, Bot, Cloud, Network, Smartphone, Workflow, type LucideIcon } from "lucide-react";
import logo from "../../../public/assets/logo.png";

/* Coordinates share the SVG's 560×560 viewBox, so nodes and traces line up at any size. */
type Node = { icon: LucideIcon; label: string; x: number; y: number; trace: string };

const NODES: Node[] = [
  { icon: Code2,      label: "Software",   x: 96,  y: 110, trace: "M240 205V150H96V134" },
  { icon: Bot,        label: "AI Agents",  x: 464, y: 110, trace: "M320 205V150H464V134" },
  { icon: Cloud,      label: "Cloud",      x: 496, y: 300, trace: "M355 300H472" },
  { icon: Network,    label: "Networking", x: 430, y: 470, trace: "M320 355V420H430V446" },
  { icon: Smartphone, label: "Mobile",     x: 130, y: 470, trace: "M240 355V420H130V446" },
  { icon: Workflow,   label: "Automation", x: 64,  y: 300, trace: "M205 300H88" },
];

/* Short decorative traces that end in a via (dot) */
const STUBS = [
  { d: "M205 245H172V222", end: [172, 222] },
  { d: "M355 245H388V222", end: [388, 222] },
  { d: "M280 205V176",     end: [280, 176] },
  { d: "M280 355V384",     end: [280, 384] },
  { d: "M205 340H180V362", end: [180, 362] },
  { d: "M355 340H380V362", end: [380, 362] },
] as const;

const PINS = [222, 246, 270, 294, 318]; // pin offsets along each chip edge (chip spans 205–355)
const pct = (v: number) => `${(v / 560) * 100}%`;

/* ── Hero visual: AI core routing data to each solution area ────────────── */
export function HeroVisual() {
  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto" aria-hidden="true">
      {/* Ambient light */}
      <div className="absolute inset-[18%] rounded-full bg-brand-500/25 blur-[90px]" />
      <div className="absolute inset-[34%] rounded-full bg-cyan-300/20 blur-[60px]" />

      <svg viewBox="0 0 560 560" className="relative w-full h-full overflow-visible">
        <defs>
          <linearGradient id="hv-chip" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#1e3a8a" stopOpacity="0.7" />
            <stop offset="1" stopColor="#0b1f4d" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="hv-chip-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dbeafe" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#67d8ff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#2563eb" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="hv-die" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#67d8ff" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="1" stopColor="#081329" stopOpacity="0.6" />
          </radialGradient>
          <linearGradient id="hv-plate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.96" />
            <stop offset="1" stopColor="#dcebff" stopOpacity="0.9" />
          </linearGradient>
          <pattern id="hv-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="#a5e8ff" strokeOpacity="0.14" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* Radar rings */}
        <g fill="none" stroke="#67d8ff">
          <circle cx="280" cy="280" r="128" strokeOpacity="0.18" />
          <circle cx="280" cy="280" r="196" strokeOpacity="0.12" strokeDasharray="2 7" />
          <circle cx="280" cy="280" r="258" strokeOpacity="0.07" />
        </g>

        {/* Circuit traces: base line + travelling data pulse */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {NODES.map((n) => (
            <g key={n.label}>
              <path d={n.trace} stroke="#60a5fa" strokeOpacity="0.45" strokeWidth="1.5" />
              <path
                d={n.trace}
                className="anim-flow"
                stroke="#a5e8ff"
                strokeWidth="2.5"
                style={{ "--d": `${(n.x + n.y) % 7 * -0.4}s` } as React.CSSProperties}
              />
            </g>
          ))}
          {STUBS.map((s) => (
            <path key={s.d} d={s.d} stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="1.25" />
          ))}
        </g>
        {STUBS.map((s) => (
          <circle key={s.d} cx={s.end[0]} cy={s.end[1]} r="3" fill="#081329" stroke="#67d8ff" strokeOpacity="0.7" />
        ))}

        {/* Chip pins */}
        <g fill="#93c5fd" fillOpacity="0.55">
          {PINS.map((p) => (
            <g key={p}>
              <rect x={p - 3} y="193" width="6" height="12" rx="1.5" />
              <rect x={p - 3} y="355" width="6" height="12" rx="1.5" />
              <rect x="193" y={p - 3} width="12" height="6" rx="1.5" />
              <rect x="355" y={p - 3} width="12" height="6" rx="1.5" />
            </g>
          ))}
        </g>

        {/* Processor package */}
        <rect x="211" y="213" width="150" height="150" rx="22" fill="#020817" fillOpacity="0.45" />
        <rect x="205" y="205" width="150" height="150" rx="22" fill="url(#hv-chip)" stroke="url(#hv-chip-edge)" strokeWidth="1.5" />
        <rect x="206" y="206" width="148" height="60" rx="21" fill="#ffffff" fillOpacity="0.05" />

        {/* Die */}
        <rect className="anim-beam" x="234" y="234" width="92" height="92" rx="14" fill="url(#hv-die)" />
        <rect x="234" y="234" width="92" height="92" rx="14" fill="url(#hv-grid)" stroke="#a5e8ff" strokeOpacity="0.5" />
        {/* Brand mark on a light plate so the blue logo keeps its contrast against the die
            (the logo itself is an optimised next/image overlaid below) */}
        <rect x="248" y="248" width="64" height="64" rx="14" fill="url(#hv-plate)" stroke="#ffffff" strokeOpacity="0.6" />
        {/* Corner index mark */}
        <circle cx="222" cy="222" r="3" fill="#67d8ff" fillOpacity="0.8" />
      </svg>

      {/* Brand mark, centred on the chip plate (plate spans 254–306 of 560) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[9.3%]">
        <Image src={logo} alt="" sizes="56px" className="w-full h-auto" priority />
      </div>

      {/* Solution nodes. Opaque raised tiles (no backdrop blur) keep the
          continuous float animation cheap to composite. */}
      {NODES.map(({ icon: Icon, label, x, y }, i) => (
        <div
          key={label}
          // Anchor on the icon tile's centre (half its height), label hangs below
          className="absolute -translate-x-1/2 -mt-[22px] sm:-mt-6"
          style={{ left: pct(x), top: pct(y) }}
        >
          <div className="anim-float flex flex-col items-center gap-2" style={{ "--d": `${i * 0.7}s` } as React.CSSProperties}>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border border-cyan-300/30 bg-gradient-to-b from-[var(--bg-card-hover)] to-[var(--bg-card)] shadow-[inset_0_1px_0_var(--glass-highlight),0_10px_24px_rgba(2,8,23,0.28)]">
              <Icon className="w-5 h-5 text-brand-500 dark:text-cyan-300" strokeWidth={1.8} />
            </div>
            <span
              className="hidden sm:block text-xs font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
