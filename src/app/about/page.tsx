import type { Metadata } from "next";
import { MapPin, Calendar, Users, Award } from "lucide-react";
import { AboutSection }    from "@/components/sections/AboutSection";
import { ContactSection }  from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "About: Our Story & Values",
  description: "Learn about Mitcrux, Africa's AI-native tech partner built in Abuja with a mission to deliver world-class digital solutions at African-first pricing.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Mitcrux"
        title="Built in Africa."
        accent="Delivered to the world."
        description="We started with a simple belief: that African businesses deserve the same quality of AI-powered technology that enterprises in London, New York, and Tokyo take for granted. So we built it."
      >
        {/* Quick facts bar */}
        <div className="max-w-3xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: Calendar, label: "Founded",   value: "2020" },
            { icon: MapPin,   label: "HQ",        value: "Abuja, NG" },
            { icon: Users,    label: "Team",       value: "10–25 people" },
            { icon: Award,    label: "Projects",   value: "40+ delivered" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-panel flex flex-col items-center text-center gap-2 p-5">
              <Icon className="w-5 h-5 text-brand-400 dark:text-cyan-300" aria-hidden="true" />
              <span className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>{value}</span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </PageHeader>

      <AboutSection />
      <ContactSection />
    </>
  );
}
