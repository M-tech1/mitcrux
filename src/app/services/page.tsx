import type { Metadata } from "next";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection }  from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Services: AI-Powered Digital Solutions",
  description: "Explore Mitcrux's full suite across 4 divisions: Digital Solutions, Managed IT, Business Support, and Growth & Specialized services.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Every capability your"
        accent="business needs."
        description="4 service divisions. 11 specialties. All delivered by one team."
      />

      <ServicesSection />
      <ContactSection />
    </>
  );
}
