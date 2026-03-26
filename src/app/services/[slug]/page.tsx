import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { ServiceIcon, SectionTag, GlowOrb, DotGrid, Badge } from "@/components/ui";
import { ContactSection } from "@/components/sections/ContactSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

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

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "var(--bg-page)" }}>
        <DotGrid className="opacity-40" />
        <GlowOrb color="brand" size="xl" className="-left-32 -top-32 opacity-[0.1]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${service.accent} 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-10 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            All Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <ServiceIcon icon={service.icon} accent={service.accent} size="lg" className="group" />
                <span
                  className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-lg border"
                  style={{ color: service.accent, background: `${service.accent}15`, borderColor: `${service.accent}30` }}
                >
                  {service.category}
                </span>
              </div>

              <h1 className="font-display font-extrabold text-4xl md:text-5xl xl:text-6xl leading-tight tracking-tight mb-6" style={{ color: "var(--text-primary)" }}>
                {service.title}
              </h1>
              <p className="text-xl font-light leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                {service.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="btn-primary px-7 py-3.5 group">
                  Get a Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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

            {/* Right — Features */}
            <div className="rounded-2xl p-7 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>
              <p className="font-mono text-2xs tracking-widest uppercase text-slate-600 mb-5">
                What's included
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: service.accent }}
                      strokeWidth={2}
                    />
                    <span className="text-slate-300 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="py-24" style={{ background: "var(--bg-card-2)" }}>
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
                  <p className="stat-number text-3xl font-display font-extrabold">{pkg.price}</p>
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

      {/* ── Contact ── */}
      <ContactSection />

      {/* ── Related services ── */}
      <section className="py-20 border-t" style={{ background: "var(--bg-page)", borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display font-bold text-2xl mb-8" style={{ color: "var(--text-primary)" }}>
            Explore other services
          </h2>
          <ServicesSection preview />
        </div>
      </section>
    </>
  );
}
