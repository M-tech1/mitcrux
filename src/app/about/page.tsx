import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Calendar, Users, Award } from "lucide-react";
import { AboutSection }    from "@/components/sections/AboutSection";
import { ContactSection }  from "@/components/sections/ContactSection";
import { GlowOrb, DotGrid, SectionTag } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — Our Story & Values",
  description: "Learn about Mitcrux — Africa's AI-native tech partner built in Abuja with a mission to deliver world-class digital solutions at African-first pricing.",
};

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="relative pt-36 pb-20 overflow-hidden text-center" style={{ background: "var(--bg-page)" }}>
        <DotGrid className="opacity-30" />
        <GlowOrb color="brand" size="xl" className="-top-32 left-1/4 opacity-[0.1]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <SectionTag className="mb-6">About Mitcrux</SectionTag>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl tracking-tight leading-tight mb-6" style={{ color: "var(--text-primary)" }}>
            Built in Africa.<br />
            <span className="text-gradient">Delivered to the world.</span>
          </h1>
          <p className="text-xl font-light leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            We started with a simple belief — that African businesses deserve the same
            quality of AI-powered technology that enterprises in London, New York, and
            Tokyo take for granted. So we built it.
          </p>
        </div>

        {/* Quick facts bar */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 mt-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "Founded",   value: "2020" },
              { icon: MapPin,   label: "HQ",        value: "Abuja, NG" },
              { icon: Users,    label: "Team",       value: "10–25 people" },
              { icon: Award,    label: "Projects",   value: "40+ delivered" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-5 rounded-2xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>
                <Icon className="w-5 h-5 text-brand-400" />
                <span className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>{value}</span>
                <span className="font-mono text-2xs uppercase tracking-widest text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutSection />
      <ContactSection />
    </>
  );
}
