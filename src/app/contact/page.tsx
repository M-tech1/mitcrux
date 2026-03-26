import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Start a Project",
  description: "Get in touch with Mitcrux. Free 30-minute consultation. We respond within 24 hours.",
};

export default function ContactPage() {
  return <ContactSection standalone />;
}
