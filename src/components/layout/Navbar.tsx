"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_LINKS } from "@/lib/constants";
import Image from "next/image";
import logo from "../../../public/assets/logo.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  /* Scroll detection */
  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-brand-sm"
            : "py-5 bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-blue group-hover:shadow-glow-cyan transition-all duration-300"> */}
            {/* <Zap className="w-4 h-4 text-white" strokeWidth={2.5} /> */}
            <Image
              src={logo}
              alt="Logo Image"
              sizes="30"
              className="w-12 
               "
            />
            {/* <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" /> */}
            {/* </div> */}
            <span
              className="font-display font-extrabold text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span style={{ color: "var(--text-primary)" }}>MIT</span>
              <span className="text-gradient">CRUX</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200",
                    active
                      ? "text-brand-600 dark:text-cyan-400 bg-brand-600/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA + Theme */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              className="btn-primary text-sm px-5 py-2.5 group"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-400",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 backdrop-blur-2xl bg-[var(--bg-page)]"
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu content */}
        <div
          className={cn(
            "relative h-full flex flex-col px-6 pt-24 pb-10 transition-all duration-400",
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
          )}
        >
          {/* Links */}
          <nav className="flex flex-col gap-1 flex-1">
            {NAV_LINKS.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-4 rounded-xl text-lg font-display font-semibold transition-all duration-200",
                    active
                      ? "text-cyan-400 bg-brand-600/15 border border-brand-500/20"
                      : "text-slate-300 hover:text-white hover:bg-white/5",
                  )}
                  style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
                >
                  {link.label}
                  <ArrowRight className="w-4 h-4 opacity-40" />
                </Link>
              );
            })}
          </nav>

          {/* Bottom CTA */}
          <div className="pt-6 border-t border-white/10">
            <Link
              href="/contact"
              className="btn-primary w-full justify-center text-base py-4"
            >
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-6 mt-6">
              <a
                href="mailto:info@mitcrux.com"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                info@mitcrux.com
              </a>
              <span className="text-slate-700">·</span>
              <a
                href="tel:+2349026611164"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                +234 902 661 1164
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
