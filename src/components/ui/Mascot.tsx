"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export type MascotPose = "idle" | "wave" | "point";

/* Arm capsule anchored at a shoulder point, rotated around it */
function Arm({
  shoulder: [sx, sy],
  angle,
  length = 62,
  fill,
  className,
}: {
  shoulder: [number, number];
  angle: number;
  length?: number;
  fill: string;
  className?: string;
}) {
  return (
    <g
      className={className}
      style={{ transformOrigin: `${sx}px ${sy}px`, transform: `rotate(${angle}deg)` }}
    >
      <rect x={sx - 11} y={sy - 6} width="22" height={length} rx="11" fill={fill} />
      <circle cx={sx} cy={sy + length - 2} r="13" fill={fill} />
      <circle cx={sx - 4} cy={sy + length - 6} r="4" fill="#ffffff" fillOpacity="0.7" />
    </g>
  );
}

/**
 * "Crux", the Mitcrux AI assistant mascot: an original glossy robot drawn in
 * the brand palette. Purely decorative, so it is hidden from assistive tech.
 */
export function Mascot({
  pose = "idle",
  className,
}: {
  pose?: MascotPose;
  className?: string;
}) {
  // Unique gradient ids so several mascots can share a page
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;

  return (
    <svg
      viewBox="0 0 240 300"
      className={cn("overflow-visible", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id("shell")} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e3eeff" />
          <stop offset="1" stopColor="#a9c3ec" />
        </linearGradient>
        <linearGradient id={id("visor")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#13285a" />
          <stop offset="1" stopColor="#060f24" />
        </linearGradient>
        <linearGradient id={id("accent")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#67d8ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#67d8ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("shadow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#020817" stopOpacity="0.55" />
          <stop offset="1" stopColor="#020817" stopOpacity="0" />
        </radialGradient>
        <filter id={id("blur")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Ground shadow (stays put while the body floats) */}
      <ellipse cx="120" cy="288" rx="58" ry="9" fill={url("shadow")} />

      <g className="mascot-float">
        {/* Back arm (left side) */}
        <Arm
          shoulder={[66, 172]}
          angle={pose === "point" ? 18 : 14}
          fill={url("shell")}
        />

        {/* Torso */}
        <rect x="68" y="150" width="104" height="104" rx="44" fill={url("shell")} />
        <path d="M84 168c10-10 26-14 40-14" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.8" fill="none" />
        {/* Chest core */}
        <rect x="96" y="184" width="48" height="36" rx="14" fill={url("visor")} />
        <circle cx="120" cy="202" r="14" fill={url("glow")} className="anim-beam" />
        <circle cx="120" cy="202" r="7" fill="none" stroke="#67d8ff" strokeWidth="2.5" />
        <circle cx="120" cy="202" r="2.5" fill="#dff6ff" />

        {/* Front arm (right side) */}
        {pose === "wave" ? (
          <Arm shoulder={[176, 170]} angle={200} length={58} fill={url("shell")} className="mascot-wave" />
        ) : pose === "point" ? (
          <Arm shoulder={[176, 172]} angle={-78} length={66} fill={url("shell")} />
        ) : (
          <Arm shoulder={[174, 172]} angle={-14} fill={url("shell")} />
        )}

        {/* Neck */}
        <rect x="106" y="136" width="28" height="20" rx="8" fill="#8fb0e3" />

        {/* Ears */}
        <circle cx="50" cy="94" r="13" fill={url("accent")} />
        <circle cx="190" cy="94" r="13" fill={url("accent")} />
        <circle cx="46" cy="90" r="4" fill="#ffffff" fillOpacity="0.6" />

        {/* Antenna */}
        <line x1="120" y1="42" x2="120" y2="20" stroke="#8fb0e3" strokeWidth="5" strokeLinecap="round" />
        <circle cx="120" cy="15" r="16" fill={url("glow")} className="anim-beam" />
        <circle cx="120" cy="15" r="7" fill="#67d8ff" />

        {/* Head */}
        <rect x="52" y="38" width="136" height="110" rx="50" fill={url("shell")} />
        <path d="M72 64c12-14 32-20 52-20" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />

        {/* Visor */}
        <rect x="68" y="60" width="104" height="70" rx="34" fill={url("visor")} />
        <path d="M84 72c10-6 24-8 40-7" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="5" strokeLinecap="round" fill="none" />

        {/* Eyes + smile */}
        <g filter={url("blur")} opacity="0.85">
          <rect x="92" y="80" width="16" height="24" rx="8" fill="#67d8ff" />
          <rect x="132" y="80" width="16" height="24" rx="8" fill="#67d8ff" />
        </g>
        <g className="mascot-blink">
          <rect x="94" y="82" width="12" height="20" rx="6" fill="#dff6ff" />
          <rect x="134" y="82" width="12" height="20" rx="6" fill="#dff6ff" />
        </g>
        <path d="M106 113q14 10 28 0" stroke="#67d8ff" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
