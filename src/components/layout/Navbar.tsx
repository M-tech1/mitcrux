"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_LINKS } from "@/lib/constants";
import Image from "next/image";
import logo from "../../../public/assets/logo.png";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function Wordmark() {
  return (
    <span className="font-display font-extrabold text-xl tracking-tight">
      <span style={{ color: "var(--text-primary)" }}>MIT</span>
      <span className="text-gradient">CRUX</span>
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* Lock body scroll + close on Escape while the menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,border-color,box-shadow] duration-500",
          scrolled || menuOpen
            ? "py-3 border-b border-[var(--border-subtle)] bg-[var(--nav-bg)] backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.12)]"
            : "py-5 border-b border-transparent bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 rounded-lg" aria-label="Mitcrux home">
            <Image src={logo} alt="" sizes="44px" className="w-11 h-auto" priority />
            <Wordmark />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-2xl p-1 border border-[var(--glass-border)] bg-[var(--glass-bg)]">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200",
                        active
                          ? "text-[var(--text-primary)] bg-[var(--bg-card)] shadow-[inset_0_1px_0_var(--glass-highlight)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      {link.label}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute left-1/2 -translate-x-1/2 -bottom-px h-px w-6 bg-gradient-to-r from-brand-400 to-cyan-300"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA + Theme */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/contact" className="btn-primary text-sm px-5 py-2.5 group">
              Get Started
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-[opacity,visibility] duration-300",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[var(--bg-page)]"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-ambient" />
        </div>

        {/* Menu content */}
        <div
          className={cn(
            "relative h-full flex flex-col px-5 pt-24 pb-10 overflow-y-auto transition-transform duration-300",
            menuOpen ? "translate-y-0" : "-translate-y-3",
          )}
        >
          <nav aria-label="Mobile" className="flex-1">
            <ul className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between px-5 py-4 rounded-2xl text-lg font-display font-semibold border transition-colors duration-200",
                        active
                          ? "border-[var(--border-hover)] bg-[var(--glass-bg)] text-[var(--text-primary)]"
                          : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]",
                      )}
                    >
                      {link.label}
                      <ArrowRight
                        className={cn("w-4 h-4", active ? "text-cyan-300" : "opacity-40")}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom CTA */}
          <div className="pt-6 mt-6 border-t border-[var(--border-subtle)]">
            <Link href="/contact" className="btn-primary w-full justify-center text-base py-4">
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex flex-col items-center gap-3 mt-6 text-sm" style={{ color: "var(--text-secondary)" }}>
              <a href="mailto:info@mitcrux.com" className="inline-flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors">
                <Mail className="w-4 h-4" aria-hidden="true" />
                info@mitcrux.com
              </a>
              <a href="tel:+2349026611164" className="inline-flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors">
                <Phone className="w-4 h-4" aria-hidden="true" />
                +234 902 661 1164
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
