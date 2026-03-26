import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hammer, ExternalLink } from "lucide-react";
import { GlowOrb, DotGrid, SectionTag } from "@/components/ui";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Work — Our Portfolio",
  description: "Explore Mitcrux's portfolio of AI-powered products, MVPs, and digital solutions.",
};

const CASE_STUDIES = [
  {
    id: 1,
    title: "PayFlowNG — Fintech MVP",
    category: "MVP Development",
    description: "Built and launched a complete payment platform MVP in 4 weeks. Auth, wallet, P2P transfers, and admin dashboard — all from scratch.",
    tags: ["Next.js", "Supabase", "Stripe", "React Native"],
    accent: "#1a72d7",
    result: "Launched on schedule. Raised seed round within 60 days.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&q=80&auto=format&fit=crop",
    imageAlt: "Fintech payment application on phone screen",
    span: "lg:col-span-2",
  },
  {
    id: 2,
    title: "StyleHouse AI Support Agent",
    category: "AI Agents",
    description: "Deployed a WhatsApp AI agent handling 90% of customer queries autonomously.",
    tags: ["LangChain", "Claude AI", "n8n", "Twilio"],
    accent: "#00b4d8",
    result: "Response time: 4hrs → 2 mins. Support cost cut 60%.",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&q=80&auto=format&fit=crop",
    imageAlt: "AI chatbot interface on mobile phone",
    span: "lg:col-span-1",
  },
  {
    id: 3,
    title: "TechBridge Invoice Automation",
    category: "AI Automation",
    description: "End-to-end invoice processing pipeline — extract, validate, match, and route 500+ invoices per week with zero human touch.",
    tags: ["Python", "GPT-4o", "Zapier", "Google Sheets"],
    accent: "#10b981",
    result: "40 hours/week saved. Full ROI in month one.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop",
    imageAlt: "Business analytics dashboard with charts",
    span: "lg:col-span-1",
  },
  {
    id: 4,
    title: "Publisher AdSense Recovery",
    category: "AdSense Approval",
    description: "Audited, fixed, and resubmitted a news site rejected 3 times. Full content, policy, and technical overhaul in one sprint.",
    tags: ["Claude AI", "Next.js", "SEO", "Content AI"],
    accent: "#22d3ee",
    result: "Approved in 8 days. Earning $800+/mo within 90 days.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&q=80&auto=format&fit=crop",
    imageAlt: "Website analytics and revenue dashboard",
    span: "lg:col-span-2",
  },
] as const;

export default function WorkPage() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-20 overflow-hidden text-center" style={{ background: "var(--bg-page)" }}>
        <div className="absolute inset-0 dark:bg-grid-dark bg-grid-light opacity-40" />
        <GlowOrb color="brand" size="xl" className="-top-32 right-1/4 opacity-[0.08]" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <SectionTag className="mb-6">Our Work</SectionTag>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl tracking-tight leading-tight mb-6" style={{ color: "var(--text-primary)" }}>
            Built. Shipped.{" "}
            <em className="not-italic text-gradient">Results delivered.</em>
          </h1>
          <p className="text-xl font-light leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            A selection of projects across our service lines — each with a real, measurable outcome.
          </p>
        </div>
      </section>

      {/* Case studies grid */}
      <section className="py-20" style={{ background: "var(--bg-card-2)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs) => (
              <div
                key={cs.id}
                className={`group relative rounded-3xl overflow-hidden border transition-all duration-400 hover:-translate-y-1 ${cs.span}`}
                style={{
                  borderColor: "var(--border-card)",
                  background: "var(--bg-card)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {/* Image */}
                <div className="relative w-full h-52 overflow-hidden">
                  <Image
                    src={cs.image}
                    alt={cs.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${cs.accent}33 0%, transparent 60%)`,
                    }}
                  />
                  {/* Category badge over image */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-2xs font-mono tracking-widest uppercase px-2.5 py-1 rounded-md border backdrop-blur-sm"
                      style={{
                        color: cs.accent,
                        background: `${cs.accent}20`,
                        borderColor: `${cs.accent}40`,
                      }}
                    >
                      {cs.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className="font-display font-bold text-xl mb-3 leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cs.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-4 font-light"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {cs.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {cs.tags.map((t) => (
                      <span
                        key={t}
                        className="text-2xs px-2.5 py-1 rounded-md font-mono border"
                        style={{
                          color: "var(--text-muted)",
                          background: "var(--bg-card-2)",
                          borderColor: "var(--border-card)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Result */}
                  <div
                    className="p-4 rounded-xl border"
                    style={{
                      background: `${cs.accent}08`,
                      borderColor: `${cs.accent}25`,
                    }}
                  >
                    <p
                      className="font-mono text-2xs tracking-widest uppercase mb-1"
                      style={{ color: `${cs.accent}99` }}
                    >
                      Result
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {cs.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon placeholder */}
          <div
            className="text-center mt-12 p-10 rounded-2xl border-2 border-dashed"
            style={{ borderColor: "var(--border-card)" }}
          >
            <Hammer className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <p className="text-base mb-1 font-medium" style={{ color: "var(--text-secondary)" }}>
              More case studies coming soon
            </p>
            <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
              We're documenting results from recent projects
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
