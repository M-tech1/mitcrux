"use client";

import { useState } from "react";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { SectionHeading, GlowOrb } from "@/components/ui";
import { Mascot } from "@/components/ui/Mascot";
import { SERVICES } from "@/lib/constants";
import { useReveal } from "@/hooks/useGSAP";
import { cn } from "@/lib/utils";

/* ── Form field ───────────────────────────────────────────────────────────── */
function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
        {label}{" "}
        {required && (
          <span className="text-cyan-500 dark:text-cyan-300" aria-hidden="true">*</span>
        )}
      </label>
      {children}
    </div>
  );
}

/* Native select with a custom chevron (appearance-none removes the default one) */
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={cn("field appearance-none cursor-pointer pr-10", props.className)} />
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
        style={{ color: "var(--text-muted)" }}
        aria-hidden="true"
      />
    </div>
  );
}

const inputCls = "field";

/* ── Contact form ─────────────────────────────────────────────────────────── */
function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });

  const set =
    (k: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Firebase is loaded on submit so it stays out of the initial page bundle
      const { submitContactForm } = await import("@/lib/firestore");
      await submitContactForm(form);
      setStatus("sent");
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h3
            className="font-display font-bold text-2xl mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Message received.
          </h3>
          <p
            className="text-base max-w-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            We'll review your project and get back to you within 24 hours. Check
            your email for a confirmation.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="btn-ghost px-6 py-2.5 text-sm"
        >
          Send another message
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div role="alert" className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h3
            className="font-display font-bold text-2xl mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Something went wrong.
          </h3>
          <p className="text-base max-w-sm" style={{ color: "var(--text-secondary)" }}>
            We couldn't send your message. Please try again or{" "}
            <a
              href="https://wa.me/2348065191675"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
            >
              reach us on WhatsApp
            </a>
            .
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="btn-ghost px-6 py-2.5 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-busy={status === "sending"}>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field id="contact-name" label="Full Name" required>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            className={inputCls}
            placeholder="Your name"
            value={form.name}
            onChange={set("name")}
            maxLength={200}
            required
          />
        </Field>
        <Field id="contact-email" label="Email Address" required>
          <input
            id="contact-email"
            name="email"
            autoComplete="email"
            type="email"
            className={inputCls}
            placeholder="you@company.com"
            value={form.email}
            onChange={set("email")}
            maxLength={254}
            required
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field id="contact-company" label="Company / Organisation">
          <input
            id="contact-company"
            name="company"
            autoComplete="organization"
            className={inputCls}
            placeholder="Your company"
            value={form.company}
            onChange={set("company")}
            maxLength={200}
          />
        </Field>
        <Field id="contact-service" label="Service of Interest" required>
          <Select
            id="contact-service"
            name="service"
            value={form.service}
            onChange={set("service")}
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
            <option value="other">Other / Not sure yet</option>
          </Select>
        </Field>
      </div>

      <Field id="contact-budget" label="Estimated Budget">
        <Select
          id="contact-budget"
          name="budget"
          value={form.budget}
          onChange={set("budget")}
        >
          <option value="" disabled>
            Select a range
          </option>
          <option value="under-500">Under $500</option>
          <option value="500-2000">$500 – $2,000</option>
          <option value="2000-10000">$2,000 – $10,000</option>
          <option value="10000-50000">$10,000 – $50,000</option>
          <option value="50000+">$50,000+</option>
          <option value="unsure">Not sure yet</option>
        </Select>
      </Field>

      <Field id="contact-message" label="Project Details" required>
        <textarea
          id="contact-message"
          name="message"
          className={cn(inputCls, "resize-y min-h-[140px]")}
          placeholder="Tell us about your project, goals, and timeline..."
          value={form.message}
          onChange={set("message")}
          maxLength={2000}
          required
        />
      </Field>

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "btn-primary w-full justify-center py-4 text-base group",
          status === "sending" && "opacity-70 cursor-not-allowed",
        )}
      >
        {status === "sending" ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>

      <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
        We respond within 24 hours · All enquiries are confidential
      </p>
    </form>
  );
}

/* ── Contact info sidebar ─────────────────────────────────────────────────── */
function ContactInfo({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Lead copy */}
      <SectionHeading
        as={headingLevel}
        align="left"
        eyebrow="Get in Touch"
        title="Let's build your"
        accent="next big thing."
        description="Free 30-minute consultation. No commitment. Honest advice about what you need and how we can help."
      />

      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/2348065191675?text=Hi%20Mitcrux%2C%20I%27d%20like%20to%20discuss%20a%20project"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors duration-300 group"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center group-hover:scale-105 transition-transform">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1">
          <p
            className="font-display font-semibold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            Chat on WhatsApp
          </p>
          <p className="text-emerald-700 dark:text-emerald-300/80 text-sm mt-0.5">
            Instant response · +234 806 519 1675
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
      </a>

      {/* Contact details */}
      <div className=" gap-4 grid grid-cols-1 sm:grid-cols-2">
        {[
          {
            icon: Mail,
            label: "Email",
            value: "mitcrux@gmail.com",
            href: "mailto:mitcrux@gmail.com",
          },
          {
            icon: Phone,
            label: "Phone",
            value: "+234 806 519 1675",
            href: "tel:+2348065191675",
          },
          {
            icon: MapPin,
            label: "Office",
            value: "Abuja, Nigeria",
            href: undefined,
          },
          {
            icon: Clock,
            label: "Hours",
            value: "24/7 Work hours",
            href: undefined,
          },
        ].map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-[var(--glass-border)] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-brand-400 dark:text-cyan-300" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="text-sm font-medium mt-0.5 block transition-colors hover:text-[var(--text-accent)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-primary)" }}>{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Process note */}
      <div className="card-surface p-6">
        <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          What happens next
        </p>
        <ol className="space-y-3">
          {[
            "We review your message within 24 hours",
            "A brief discovery call is scheduled",
            "We send a tailored proposal & timeline",
            "Project kickoff within 48 hours of agreement",
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="font-mono text-xs mt-0.5 shrink-0" style={{ color: "var(--text-accent)" }}>
                0{i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ── Contact Section ──────────────────────────────────────────────────────── */
export function ContactSection({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const formRef = useReveal<HTMLDivElement>({ x: 40, y: 0 });
  const infoRef = useReveal<HTMLDivElement>({ x: -40, y: 0 });

  return (
    <section
      id="contact"
      className={cn("relative overflow-hidden scroll-mt-16", standalone ? "pt-36 pb-24 md:pt-44 md:pb-32" : "section-y")}
     
    >
      {/* Background */}
      <div className="absolute inset-0 bg-ambient" aria-hidden="true" />
      <GlowOrb color="brand" size="xl" className="left-[-10%] top-0 opacity-[0.10]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-24">
          {/* Info */}
          <div ref={infoRef}>
            <ContactInfo headingLevel={standalone ? "h1" : "h2"} />
          </div>

          {/* Form */}
          <div ref={formRef} className="relative lg:pt-20">
            {/* Mascot peeks out from behind the form panel */}
            <Mascot pose="wave" className="hidden lg:block absolute right-10 top-0 w-28" />
            <div className="relative glass-panel p-6 sm:p-8">
              <p className="font-display font-bold text-xl tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
                New Project Enquiry
              </p>
              <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>
                Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
