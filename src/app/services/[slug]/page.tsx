import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Clock, ClipboardList } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { ServiceIcon, SectionTag } from "@/components/ui";
import { ContactSection } from "@/components/sections/ContactSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

// Pricing/packages module is hidden for now — flip to true to bring it back.
const SHOW_PRICING = false;

// Standalone questionnaires served from /public/forms, keyed by service slug.
type IntakeForm = { href: string; label: string; eyebrow: string; heading: string; body: string };

const INTAKE_FORMS: Record<string, IntakeForm> = {
  "product-design": {
    href: "/forms/brand-discovery.html",
    label: "Start Brand Discovery",
    eyebrow: "Start here · Takes 5–8 minutes",
    heading: "Tell us about your brand",
    body: "Answer a few questions about your business, audience and style. We'll use your answers to shape a tailored proposal, so there's no back-and-forth before we begin.",
  },
  "mvp-development": {
    href: "/forms/website-app-brief.html",
    label: "Start Your Project Brief",
    eyebrow: "Start here · Takes 4–6 minutes",
    heading: "Tell us what you want to build",
    body: "A few quick questions about your business, what you need built and how it should look. Your answers become the brief for your project, so we can scope and quote it fast.",
  },
};

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) return {};
  return {
    title: `${service.title}`,
    description: service.description,
  };
}

export default function ServiceDetailPage({ params }: Props) {
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) notFound();
  const intakeForm = INTAKE_FORMS[service.slug];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-ambient" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            background: `radial-gradient(ellipse at 25% 40%, ${service.accent} 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
          {/* Back link */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium mb-10 group rounded-lg transition-colors hover:text-[var(--text-primary)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
            All Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="anim-rise">
              <div className="flex items-center gap-3 mb-6">
                <ServiceIcon icon={service.icon} accent={service.accent} size="lg" className="group" />
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-lg border"
                  style={{ color: "var(--text-accent)", background: `${service.accent}15`, borderColor: `${service.accent}30` }}
                >
                  {service.category}
                </span>
              </div>

              <h1 className="font-h1 text-h1 mb-6" style={{ color: "var(--text-primary)" }}>
                {service.title}
              </h1>
              <p className="text-lead mb-8" style={{ color: "var(--text-secondary)" }}>
                {service.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="btn-primary justify-center px-7 py-3.5 group">
                  Get a Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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

            {/* Right — Features */}
            <div className="glass-panel p-7 md:p-8 anim-drift-in" style={{ "--d": "150ms" } as React.CSSProperties}>
              <h2 className="font-display font-bold text-lg mb-5" style={{ color: "var(--text-primary)" }}>
                What&apos;s included
              </h2>
              <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-3.5">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: service.accent }}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Intake form CTA */}
          {intakeForm && (
            <div
              className="mt-16 relative overflow-hidden rounded-2xl border p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8"
              style={{
                background: `linear-gradient(135deg, ${service.accent}1f 0%, ${service.accent}08 60%, transparent 100%)`,
                borderColor: `${service.accent}40`,
              }}
            >
              <div
                className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: `${service.accent}20`, color: service.accent }}
              >
                <ClipboardList className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-accent)" }}>
                  {intakeForm.eyebrow}
                </p>
                <h2 className="font-display font-bold text-h3 mb-2" style={{ color: "var(--text-primary)" }}>
                  {intakeForm.heading}
                </h2>
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {intakeForm.body}
                </p>
              </div>
              <a
                href={intakeForm.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-[#ffffff] shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110 group"
                style={{ background: service.accent, boxShadow: `0 10px 30px -10px ${service.accent}` }}
              >
                {intakeForm.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Packages ── */}
      {SHOW_PRICING && (
        <section className="py-24" style={{ background: "var(--bg-section-tint)" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <SectionTag className="mb-4">Pricing</SectionTag>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight" style={{ color: "var(--text-primary)" }}>
                Clear packages.
                <br />
                <span className="text-gradient">No surprises.</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {service.packages.map((pkg, i) => (
                <div
                  key={i}
                  className="relative flex flex-col gap-5 p-6 rounded-2xl border transition-all duration-300 hover:border-brand-500/30 hover:-translate-y-1 hover:shadow-brand-md group surface-card"
                >
                  {/* Price */}
                  <div>
                    <p className="stat-number text-xl font-display font-extrabold">Custom Quote</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span className="text-slate-500 text-xs font-mono">{pkg.duration}</span>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <h3 className="font-display font-bold text-base mb-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors" style={{ color: "var(--text-primary)" }}>
                      {pkg.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{pkg.desc}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5">
                    <Link
                      href={`/contact?service=${service.id}&package=${pkg.name}`}
                      className="flex items-center gap-1.5 text-sm font-medium transition-colors group-hover:text-white"
                      style={{ color: `${service.accent}bb` }}
                    >
                      Get Started
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-slate-600 text-sm mt-8 font-mono">
              Need something custom? <Link href="/contact" className="text-brand-400 hover:text-cyan-400 transition-colors">Let's talk →</Link>
            </p>
          </div>
        </section>
      )}

      {/* ── Contact ── */}
      <ContactSection />

      {/* ── Related services ── */}
      <ServicesSection preview />
    </>
  );
}
