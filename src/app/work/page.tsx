import type { Metadata } from "next";
import Image from "next/image";
import { Hammer } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Work: Our Portfolio",
  description: "Explore Mitcrux's portfolio of AI-powered products, MVPs, and digital solutions.",
};

const CASE_STUDIES = [
  {
    id: 1,
    title: "PayFlowNG: Fintech MVP",
    category: "MVP Development",
    description: "Built and launched a complete payment platform MVP in 4 weeks. Auth, wallet, P2P transfers, and admin dashboard, all from scratch.",
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
    description: "End-to-end invoice processing pipeline: extract, validate, match, and route 500+ invoices per week with zero human touch.",
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
      <PageHeader
        eyebrow="Our Work"
        title="Built. Shipped."
        accent="Results delivered."
        description="A selection of projects across our service lines, each with a real, measurable outcome."
      />

      {/* Case studies grid */}
      <section className="section-y !pt-16" style={{ background: "var(--bg-section-tint)" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs) => (
              <article
                key={cs.id}
                className={`card-surface !rounded-3xl overflow-hidden flex flex-col ${cs.span}`}
              >
                {/* Image */}
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={cs.image}
                    alt={cs.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Overlay: navy tint keeps photography on-palette */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, rgba(8,19,41,0.1) 0%, rgba(8,19,41,0.6) 100%), linear-gradient(135deg, ${cs.accent}33, transparent 60%)`,
                    }}
                  />
                  {/* Category badge over image */}
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/20 bg-navy-950/60 backdrop-blur-md text-ice">
                      {cs.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <h2
                    className="font-display font-bold text-xl mb-3 leading-snug tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cs.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {cs.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {cs.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-lg border"
                        style={{
                          color: "var(--text-secondary)",
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
                    className="mt-auto p-4 rounded-xl border"
                    style={{
                      background: `${cs.accent}0d`,
                      borderColor: `${cs.accent}33`,
                    }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-accent)" }}>
                      Result
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {cs.result}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Coming soon placeholder */}
          <div
            className="text-center mt-12 p-10 rounded-2xl border border-dashed"
            style={{ borderColor: "var(--glass-border)" }}
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
