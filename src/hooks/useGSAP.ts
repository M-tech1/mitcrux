"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/* ── Lazy GSAP loader ─────────────────────────────────────────────────────── */
async function loadGSAP() {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

/* ── Helper: typed ref that satisfies JSX ref prop ───────────────────────── */
// useRef<T>(null) in React 18 returns MutableRefObject<T | null>.
// JSX ref= expects RefObject<T> (non-null). We cast once here so
// every hook below stays clean without per-call assertions.
function makeRef<T extends HTMLElement>(): RefObject<T> {
  return useRef<T>(null) as unknown as RefObject<T>;
}

/* ── Reveal on scroll ─────────────────────────────────────────────────────── */
export function useReveal<T extends HTMLElement>(
  options: {
    y?: number;
    x?: number;
    opacity?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    ease?: string;
    selector?: string;
  } = {}
): RefObject<T> {
  const ref = makeRef<T>();
  const {
    y = 40,
    x = 0,
    opacity = 0,
    duration = 0.9,
    stagger = 0.1,
    delay = 0,
    ease = "power3.out",
    selector,
  } = options;

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      if (!ref.current) return;
      const targets = selector
        ? ref.current.querySelectorAll(selector)
        : [ref.current];

      ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { y, x, opacity },
          {
            y: 0,
            x: 0,
            opacity: 1,
            duration,
            stagger,
            delay,
            ease,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    });

    return () => ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/* ── Stagger children reveal ──────────────────────────────────────────────── */
export function useStagger<T extends HTMLElement>(
  childSelector = ":scope > *",
  options: {
    y?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    start?: string;
  } = {}
): RefObject<T> {
  const ref = makeRef<T>();
  const {
    y = 32,
    duration = 0.8,
    stagger = 0.12,
    ease = "power3.out",
    start = "top 85%",
  } = options;

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      if (!ref.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          ref.current!.querySelectorAll(childSelector),
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration,
            stagger,
            ease,
            scrollTrigger: {
              trigger: ref.current,
              start,
              once: true,
            },
          }
        );
      });
    });

    return () => ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/* ── Hero entrance timeline ───────────────────────────────────────────────── */
export function useHeroTimeline<T extends HTMLElement>(): RefObject<T> {
  const ref = makeRef<T>();

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    loadGSAP().then(({ gsap }) => {
      if (!ref.current) return;
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.15 });
        const root = ref.current!;

        const tag     = root.querySelector("[data-hero='tag']");
        const heading = root.querySelectorAll("[data-hero='heading']");
        const sub     = root.querySelector("[data-hero='sub']");
        const ctas    = root.querySelector("[data-hero='ctas']");
        const stats   = root.querySelectorAll("[data-hero='stat']");
        const visual  = root.querySelector("[data-hero='visual']");
        const scroll  = root.querySelector("[data-hero='scroll']");

        if (tag)            tl.fromTo(tag,     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
        if (heading.length) tl.fromTo(heading, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: "power4.out" }, "-=0.3");
        if (sub)            tl.fromTo(sub,     { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.5");
        if (ctas)           tl.fromTo(ctas,    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4");
        if (stats.length)   tl.fromTo(stats,   { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.2");
        if (visual)         tl.fromTo(visual,  { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.0, ease: "power3.out" }, 0.4);
        if (scroll)         tl.fromTo(scroll,  { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.2");
      });
    });

    return () => ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/* ── Parallax scroll ──────────────────────────────────────────────────────── */
export function useParallax<T extends HTMLElement>(speed = 0.3): RefObject<T> {
  const ref = makeRef<T>();

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      if (!ref.current) return;
      ctx = gsap.context(() => {
        gsap.to(ref.current, {
          yPercent: -100 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    return () => ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/* ── Animated counter ─────────────────────────────────────────────────────── */
export function useCounter<T extends HTMLElement>(
  end: number,
  options: { duration?: number; prefix?: string; suffix?: string } = {}
): RefObject<T> {
  const ref = makeRef<T>();
  const { duration = 2, prefix = "", suffix = "" } = options;

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      if (!ref.current) return;
      ctx = gsap.context(() => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (ref.current)
              ref.current.textContent = prefix + Math.round(obj.val).toString() + suffix;
          },
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        });
      });
    });

    return () => ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/* ── Magnetic hover ───────────────────────────────────────────────────────── */
export function useMagnetic<T extends HTMLElement>(strength = 0.4): RefObject<T> {
  const ref = makeRef<T>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let gsapInstance: typeof import("gsap").gsap | null = null;
    loadGSAP().then(({ gsap }) => { gsapInstance = gsap; });

    const onMove = (e: MouseEvent) => {
      if (!gsapInstance) return;
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * strength;
      const dy = (e.clientY - rect.top  - rect.height / 2) * strength;
      gsapInstance.to(el, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    };

    const onLeave = () => {
      if (!gsapInstance) return;
      gsapInstance.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
