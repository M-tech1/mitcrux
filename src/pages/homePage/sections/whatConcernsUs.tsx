"use client";

import React, { JSX, useEffect, useRef, useState } from "react";

type Card = {
  id: number;
  title: string;
  excerpt: string;
  icon: React.ReactNode;
};

const CARDS: Card[] = [
  {
    id: 1,
    title: "Our Mission",
    excerpt:
      "To empower businesses with intelligent, beautifully designed, and reliable digital solutions that inspire growth, simplify processes, and make a lasting impact.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M12 2v4"
          stroke="#0EA5A4"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M6 8v8a6 6 0 0012 0V8"
          stroke="#0EA5A4"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Our Vision",
    excerpt:
      "To be a global leader in software development and AI-driven automation — helping businesses of all sizes unlock new levels of efficiency, performance, and success through technology.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M3 12h18"
          stroke="#0EA5A4"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M7 8v8"
          stroke="#0EA5A4"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M17 6v10"
          stroke="#0EA5A4"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "What We Do",
    excerpt:
      "We combine technical expertise with creative thinking to deliver end-to-end digital solutions across.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M4 6h16"
          stroke="#0EA5A4"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M4 12h10"
          stroke="#0EA5A4"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M4 18h7"
          stroke="#0EA5A4"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function WhatConcernsUs(): JSX.Element {
  const [active, setActive] = useState<number>(1); // center card active by default (index 1)
  const autoplayRef = useRef<number | null>(null);

  useEffect(() => {
    // autoplay (optional) — advance every 6s
    autoplayRef.current = window.setInterval(() => {
      setActive((prev) => (prev + 1) % CARDS.length);
    }, 6000);

    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    };
  }, []);

  function prev() {
    setActive((s) => (s - 1 + CARDS.length) % CARDS.length);
  }

  function next() {
    setActive((s) => (s + 1) % CARDS.length);
  }

  return (
    <section className="relative overflow-hidden bg-[#071526] text-white">
      {/* background pattern / texture (subtle) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(7,21,38,0.95), rgba(2,10,18,0.95)), repeating-linear-gradient(135deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 60px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="inline-block w-14 h-[1px] bg-teal-400/30" />
            <span className="text-xs uppercase tracking-widest text-cyan-400">
              Mictrux
            </span>
            <span className="inline-block w-14 h-[1px] bg-teal-400/30" />
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="block md:inline">
              {" "}
              <span className="mr-3">WHAT</span>
              <span className="font-light mx-2">MATTERS TO US</span>
            </span>
          </h2>

          <p className="mt-5 text-sm text-slate-300">
            At the heart of everything we do lies a deep commitment to our
            values. They shape our decisions, guide our actions, and define who
            we are.
          </p>
        </div>

        {/* Carousel area */}
        <div className="relative">
          {/* left arrow */}
          {/* <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 md:w-12 md:h-12 rounded-full bg-cyan-500/80 flex items-center justify-center shadow-lg ring-4 ring-slate-900/40 hover:scale-105 transition-transform"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="#04202A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button> */}

          {/* right arrow */}
          {/* <button
            aria-label="Next"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-12 h-12 md:w-12 md:h-12 rounded-full bg-cyan-500/80 flex items-center justify-center shadow-lg ring-4 ring-slate-900/40 hover:scale-105 transition-transform"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="#04202A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button> */}

          {/* Cards container - on md+ show 3 columns; on small screens show a horizontal scroller */}
          <div className="mt-8">
            <div className="hidden md:grid md:grid-cols-3 md:gap-8">
              {CARDS.map((c, idx) => {
                const isActive = idx === active;
                return (
                  <article
                    key={c.id}
                    className={`relative overflow-hidden rounded-lg border transition-transform duration-300 ease-out p-6
                      ${
                        isActive
                          ? "scale-[1.02] shadow-2xl border-cyan-300/60"
                          : "border-teal-500/20"
                      }`}
                    style={{ minHeight: 360 }}
                    role="group"
                  >
                    {/* subtle gradient overlay for each card */}
                    <div
                      aria-hidden
                      className="absolute inset-0 z-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 20%, rgba(2,8,12,0.6) 100%), linear-gradient(135deg, rgba(94,25,180,0.12), rgba(8,64,126,0.12))",
                        mixBlendMode: "overlay",
                      }}
                    />

                    <div className="relative z-10 h-full flex flex-col">
                      <div className="-mt-6">
                        <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                          {c.icon}
                        </div>
                      </div>

                      <h3 className="mt-6 text-lg font-semibold text-white">
                        {c.title}
                      </h3>

                      <div className="mt-4 flex-1">
                        {/* red vertical accent like in screenshot */}
                        <div className="pl-4 border-l-2 border-red-600/80 text-slate-200 text-sm leading-relaxed">
                          {c.excerpt}
                        </div>
                      </div>

                      <div className="mt-6">
                        <a
                          href="#"
                          className="text-sm text-cyan-300 inline-flex items-center gap-2"
                        >
                          Read More ▸
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Mobile horizontal scroller */}
            <div className="md:hidden overflow-x-auto pb-4 -mx-6 px-6 scroll-smooth">
              <div className="flex gap-6 w-max">
                {CARDS.map((c, idx) => {
                  const isActive = idx === active;
                  return (
                    <article
                      key={c.id}
                      className={`min-w-[270px] w-[85vw] sm:w-[420px] rounded-lg border p-5 flex-shrink-0 transition-transform duration-300 ${
                        isActive
                          ? "scale-105 shadow-2xl border-cyan-400/60"
                          : "border-teal-500/20"
                      }`}
                    >
                      <div className="-mt-3">
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                          {c.icon}
                        </div>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">
                        {c.title}
                      </h3>
                      <div className="mt-3 pl-3 border-l-2 border-red-600/80 text-slate-200 text-sm">
                        {c.excerpt}
                      </div>
                      <a className="mt-4 block text-teal-300 text-sm">
                        Read More ▸
                      </a>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          {/* pager dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {CARDS.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`w-3 h-3 rounded-full transition-transform ${
                  i === active
                    ? "scale-110 bg-teal-400 shadow-[0_6px_10px_rgba(16,185,129,0.12)]"
                    : "bg-slate-600/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
