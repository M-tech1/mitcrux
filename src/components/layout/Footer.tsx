import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { SERVICES, NAV_LINKS } from "@/lib/constants";
import logo from "../../../public/assets/logo.png";

const SOCIALS = [
  { label: "LinkedIn",  href: "https://linkedin.com/company/mitcrux",   icon: Linkedin },
  { label: "X/Twitter", href: "https://twitter.com/mitcrux",             icon: Twitter },
  // { label: "GitHub",    href: "https://github.com/mitcrux",              icon: Github },
  { label: "WhatsApp",  href: "https://wa.me/2348065191675",             icon: MessageCircle },
] as const;

const linkCls = "text-sm transition-colors hover:text-[var(--text-accent)]";
const headingCls = "font-display font-bold text-sm mb-5";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--border-subtle)] overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* CTA Banner */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 pt-16">
        <div className="relative glass-panel overflow-hidden px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="absolute inset-0 bg-ambient pointer-events-none" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-display font-extrabold text-h3 mb-2" style={{ color: "var(--text-primary)" }}>
              Ready to build something{" "}
              <span className="text-gradient">remarkable?</span>
            </h2>
            <p className="text-lead" style={{ color: "var(--text-secondary)" }}>
              Let&apos;s talk about your project, free 30-minute consultation.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/contact" className="btn-primary justify-center px-7 py-3.5 group">
              Start a Project
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://wa.me/2348065191675"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost justify-center px-7 py-3.5"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit rounded-lg" aria-label="Mitcrux home">
              <Image src={logo} alt="" sizes="40px" className="w-10 h-auto" />
              <span className="font-display font-extrabold text-xl tracking-tight">
                <span style={{ color: "var(--text-primary)" }}>MIT</span>
                <span className="text-gradient">CRUX</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
              Africa&apos;s fastest AI-powered tech partner.
              Delivering excellence through powerful software development, intelligent AI automation, &amp; inspiring product design. <br/> All built to move your ideas forward.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:text-[var(--text-accent)] hover:border-[var(--border-hover)] transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className={headingCls} style={{ color: "var(--text-primary)" }}>
              Services
            </h3>
            <ul className="space-y-3">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.slug}`} className={linkCls} style={{ color: "var(--text-secondary)" }}>
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-sm font-semibold transition-colors flex items-center gap-1 hover:underline" style={{ color: "var(--text-accent)" }}>
                  View all services <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h3 className={headingCls} style={{ color: "var(--text-primary)" }}>
              Company
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls} style={{ color: "var(--text-secondary)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className={linkCls} style={{ color: "var(--text-secondary)" }}>
                  Book Consultation
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className={headingCls} style={{ color: "var(--text-primary)" }}>
              Contact
            </h3>
            <ul className="space-y-4" style={{ color: "var(--text-secondary)" }}>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-400 dark:text-cyan-300 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <a href="mailto:info@mitcrux.com" className={`${linkCls} block`}>
                    info@mitcrux.com
                  </a>
                  <a href="mailto:support@mitcrux.com" className="text-xs transition-colors hover:text-[var(--text-accent)] block mt-0.5" style={{ color: "var(--text-muted)" }}>
                    support@mitcrux.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-400 dark:text-cyan-300 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <a href="tel:+2348065191675" className={`${linkCls} block`}>
                    +234 806 519 1675
                  </a>
                  <a href="https://wa.me/2348065191675" className="text-xs transition-colors hover:text-[var(--text-accent)] block mt-0.5" style={{ color: "var(--text-muted)" }}>
                    WhatsApp: +234 806 519 1675
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-400 dark:text-cyan-300 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <a href="tel:+447519929532" className={`${linkCls} block`}>
                    +44 7519 929532
                  </a>
                  <p className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>
                    UK Contact Line
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-400 dark:text-cyan-300 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <span className="text-sm block">Abuja, Nigeria</span>
                  <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>24/7 Work Hours</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-center sm:text-left" style={{ color: "var(--text-muted)" }}>
            © {year} Mitcrux. All rights reserved. Built with AI · Delivered with precision.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-sm transition-colors hover:text-[var(--text-accent)]" style={{ color: "var(--text-muted)" }}>Privacy Policy</Link>
            <Link href="/terms"   className="text-sm transition-colors hover:text-[var(--text-accent)]" style={{ color: "var(--text-muted)" }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
