import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Clock, Award } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { SectionTag, GlowOrb, DotGrid } from "@/components/ui";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Mitcrux Academy — AI & Tech Training",
  description: "Practical AI, automation, and software development training for individuals and corporate teams. Online and in-person in Abuja.",
};

const academyService = SERVICES.find((s) => s.id === "it-training")!;

export default function AcademyPage() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "var(--bg-page)" }}>
        <DotGrid className="opacity-30" />
        <GlowOrb color="brand" size="xl" className="-top-32 left-0 opacity-[0.1]" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTag className="mb-6">Mitcrux Academy</SectionTag>
              <h1 className="font-display font-extrabold text-5xl md:text-6xl tracking-tight leading-tight mb-6" style={{ color: "var(--text-primary)" }}>
                Skills that build<br />
                <span className="text-gradient">the future.</span>
              </h1>
              <p className="text-slate-400 text-xl font-light leading-relaxed mb-8">
                Practical, hands-on AI and tech training — for individuals who want to level up and 
                companies who want their teams to work smarter.
              </p>
              <div className="flex gap-3">
                <Link href="/contact?service=it-training" className="btn-primary px-7 py-3.5 group">
                  Enrol Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/contact?service=it-training&type=corporate" className="btn-ghost px-7 py-3.5">
                  Corporate Training
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, value: "8",      label: "Courses",        color: "#1a72d7" },
                { icon: Users,    value: "04+",   label: "Alumni",         color: "#00b4d8" },
                { icon: Clock,    value: "1–12wk", label: "Course Lengths", color: "#10b981" },
                { icon: Award,    value: "100%",   label: "Practical",      color: "#a855f7" },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="p-6 rounded-2xl bg-surface-800 border border-white/6 flex flex-col gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <p className="stat-number text-3xl font-display font-extrabold">{value}</p>
                    <p className="font-mono text-2xs tracking-widest uppercase text-slate-600 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-24" style={{ background: "var(--bg-card-2)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionTag className="mb-4">Courses</SectionTag>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight" style={{ color: "var(--text-primary)" }}>
              What you'll learn
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {academyService.packages.map((pkg, i) => (
              <div
                key={i}
                className="group flex flex-col gap-4 p-6 rounded-2xl border hover:border-pink-500/25 hover:-translate-y-1 transition-all duration-300" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="stat-number text-lg font-display font-extrabold">Custom Quote</span>
                  <span className="text-xs font-mono text-slate-600 border border-white/8 px-2 py-1 rounded-md">{pkg.duration}</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base mb-2 group-hover:text-pink-300 transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{pkg.desc}</p>
                </div>
                <Link
                  href={`/contact?service=it-training&course=${pkg.name}`}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm text-pink-400/80 hover:text-pink-300 transition-colors font-medium"
                >
                  Enrol <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
