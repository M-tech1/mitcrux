import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ProcessSection } from "@/components/sections/ProcessSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection preview />
      <AboutSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
