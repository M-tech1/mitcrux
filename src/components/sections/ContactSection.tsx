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
} from "lucide-react";
import { submitContactForm } from "@/lib/firestore";
import { SectionTag, GlowOrb, DotGrid } from "@/components/ui";
import { SERVICES } from "@/lib/constants";
import { useReveal } from "@/hooks/useGSAP";
import { cn } from "@/lib/utils";

/* ── Form field ───────────────────────────────────────────────────────────── */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-2xs tracking-widest uppercase text-slate-500">
        {label} {required && <span className="text-cyan-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = cn(
  "w-full px-4 py-3 rounded-xl text-sm font-body border",
  "focus:outline-none focus:border-brand-500/50",
  "focus:outline-none focus:border-brand-500/50",
  "transition-all duration-200",
);

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
      await submitContactForm(form);
      setStatus("sent");
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
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
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" required>
          <input
            className={inputCls}
            placeholder="Your name"
            value={form.name}
            onChange={set("name")}
            maxLength={200}
            required
          />
        </Field>
        <Field label="Email Address" required>
          <input
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
        <Field label="Company / Organisation">
          <input
            className={inputCls}
            placeholder="Your company"
            value={form.company}
            onChange={set("company")}
            maxLength={200}
          />
        </Field>
        <Field label="Service of Interest" required>
          <select
            className={cn(inputCls, "appearance-none cursor-pointer")}
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
          </select>
        </Field>
      </div>

      <Field label="Estimated Budget">
        <select
          className={cn(inputCls, "appearance-none cursor-pointer")}
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
        </select>
      </Field>

      <Field label="Project Details" required>
        <textarea
          className={cn(inputCls, "resize-none min-h-[140px]")}
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

      <p className="text-slate-600 text-xs text-center">
        We respond within 24 hours · All enquiries are confidential
      </p>
    </form>
  );
}

/* ── Contact info sidebar ─────────────────────────────────────────────────── */
function ContactInfo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Lead copy */}
      <div>
        <SectionTag className="mb-4">Get in Touch</SectionTag>
        <h2
          className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Let's build your
          <br />
          <span className="text-gradient">next big thing.</span>
        </h2>
        <p
          className="text-lg leading-relaxed font-light"
          style={{ color: "var(--text-secondary)" }}
        >
          Free 30-minute consultation. No commitment. Honest advice about what
          you need and how we can help.
        </p>
      </div>

      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/2348065191675?text=Hi%20Mitcrux%2C%20I%27d%20like%20to%20discuss%20a%20project"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/35 transition-all duration-300 group"
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
          <p className="text-emerald-400/70 text-xs mt-0.5">
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
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-3.5 h-3.5 text-brand-400" />
            </div>
            <div>
              <p className="font-mono text-2xs tracking-widest uppercase text-slate-600">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="text-slate-300 text-sm hover:text-white transition-colors mt-0.5 block"
                >
                  {value}
                </a>
              ) : (
                <p className="text-slate-300 text-sm mt-0.5">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Process note */}
      <div className="p-5 rounded-2xl border">
        <p className="font-mono text-2xs tracking-widest uppercase text-slate-600 mb-3">
          What happens next
        </p>
        <ol className="space-y-2">
          {[
            "We review your message within 24 hours",
            "A brief discovery call is scheduled",
            "We send a tailored proposal & timeline",
            "Project kickoff within 48 hours of agreement",
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-slate-400"
            >
              <span className="font-mono text-brand-500 text-2xs mt-0.5 shrink-0">
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
      className={cn("relative overflow-hidden", standalone ? "py-32" : "py-28")}
    >
      {/* Background */}
      <DotGrid className="opacity-25" />
      <GlowOrb
        color="brand"
        size="xl"
        className="left-[-10%] top-0 opacity-[0.08]"
      />
      <GlowOrb
        color="cyan"
        size="lg"
        className="right-[-5%] bottom-0 opacity-[0.06]"
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Info */}
          <div ref={infoRef}>
            <ContactInfo />
          </div>

          {/* Form */}
          <div ref={formRef}>
            <div className="rounded-2xl p-8 backdrop-blur-sm border">
              <p className="font-mono text-2xs tracking-widest uppercase text-slate-600 mb-6">
                New Project Enquiry
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
