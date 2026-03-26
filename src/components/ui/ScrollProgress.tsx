"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pos = el.scrollTop  || document.body.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (pos / max) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[2px] transition-all duration-100"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #1a56a0, #1a72d7, #00b4d8)",
        boxShadow: "0 0 8px rgba(0, 180, 216, 0.6)",
      }}
      aria-hidden="true"
    />
  );
}
