import Link from "next/link";
import { ArrowRight, Zap, Mail, Phone, MapPin} from "lucide-react";
import { SERVICES, NAV_LINKS } from "@/lib/constants";

const SOCIALS = [
  { label: "LinkedIn",  href: "https://linkedin.com/company/mitcrux",   icon: "in" },
  { label: "X/Twitter", href: "https://twitter.com/mitcrux",             icon: "𝕏" },
  // { label: "GitHub",    href: "https://github.com/mitcrux",              icon: "gh" },
  { label: "WhatsApp",  href: "https://wa.me/2348065191675",             icon: "WA" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--border-subtle)] overflow-hidden" style={{ background: "var(--bg-page)" }}>
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/4 rounded-full blur-3xl pointer-events-none" />

      {/* CTA Banner */}
      <div className="relative border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-2" style={{ color: "var(--text-primary)" }}>
              Ready to build something{" "}
              <span className="text-gradient">remarkable?</span>
            </h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Let's talk about your project — free 30-minute consultation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/contact" className="btn-primary px-7 py-3.5 group">
              Start a Project
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://wa.me/2348065191675"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost px-7 py-3.5"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight">
                <span className="text-white">MIT</span>
                <span className="text-gradient">CRUX</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Africa's fastest AI-powered tech partner. 
              Delivering excellence through powerful software development, intelligent AI automation, & inspiring product design. <br/> All built to move your ideas forward.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg glass-brand flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 text-xs font-mono font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-sm mb-5 tracking-wide uppercase" style={{ color: "var(--text-primary)" }}>
              Services
            </h4>
            <ul className="space-y-3">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-slate-400 text-sm hover:text-cyan-400 transition-colors underline-anim"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-brand-400 text-sm hover:text-cyan-400 transition-colors flex items-center gap-1">
                  View all services <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-sm mb-5 tracking-wide uppercase" style={{ color: "var(--text-primary)" }}>
              Company
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="text-slate-400 text-sm hover:text-white transition-colors">
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm mb-5 tracking-wide uppercase" style={{ color: "var(--text-primary)" }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <div>
                  <a href="mailto:info@mitcrux.com" className="text-slate-400 text-sm hover:text-white transition-colors block">
                    info@mitcrux.com
                  </a>
                  <a href="mailto:support@mitcrux.com" className="text-slate-500 text-xs hover:text-slate-400 transition-colors block mt-0.5">
                    support@mitcrux.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+2349026611164" className="text-slate-400 text-sm hover:text-white transition-colors block">
                    +234 806 519 1675
                  </a>
                  <a href="https://wa.me/2348065191675" className="text-slate-500 text-xs hover:text-cyan-400 transition-colors block mt-0.5">
                    WhatsApp: +234 806 519 1675
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+2349026611164" className="text-slate-400 text-sm hover:text-white transition-colors block">
                   +44 7519 929532
                  </a>
                  <p className="text-slate-500 text-xs hover:text-cyan-400 transition-colors block mt-0.5">
                    UK Contact Line
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 text-sm block">Abuja, Nigeria</span>
                  <span className="text-slate-500 text-xs block mt-0.5">24/7 Work Hours</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {year} Mitcrux. All rights reserved. Built with AI · Delivered with precision.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-slate-600 text-xs hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="text-slate-600 text-xs hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
