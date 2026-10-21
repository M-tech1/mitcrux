"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * Cursor-following light on cards. One delegated listener per container sets
 * --mx / --my on the hovered `[data-spotlight]` card; the glow itself is the
 * `.spotlight` CSS class. Skipped on touch-only devices.
 */
export function useSpotlight<T extends HTMLElement>(): RefObject<T> {
  const ref = useRef<T>(null) as unknown as RefObject<T>;

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia("(hover: hover)").matches) return;

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>("[data-spotlight]");
      if (!card || !root.contains(card)) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    return () => root.removeEventListener("pointermove", onMove);
  }, [ref]);

  return ref;
}
