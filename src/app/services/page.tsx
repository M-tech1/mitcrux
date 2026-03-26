import type { Metadata } from "next";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection }  from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Services — AI-Powered Digital Solutions",
  description: "Explore Mitcrux's full suite: Rapid MVPs, AI Agents, Automation, AdSense Approval, Design, Networking, Smart Home, and IT Training.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Page hero */}
      <div className="relative pt-36 pb-16 text-center overflow-hidden" style={{ background: "var(--bg-page)" }}>
        <div className="absolute inset-0 bg-grid-dark opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/10 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <span className="tag-pill mb-6 inline-flex">Services</span>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl tracking-tight leading-tight mb-6" style={{ color: "var(--text-primary)" }}>
            Every capability your<br />
            <span className="text-gradient">business needs.</span>
          </h1>
          <p className="text-xl font-light leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Eight integrated service lines. All AI-accelerated. All delivered by one team.
          </p>
        </div>
      </div>

      <ServicesSection />
      <ContactSection />
    </>
  );
}
