import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen pt-36 md:pt-44 pb-24">
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-ambient" aria-hidden="true" />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-6">
        <h1 className="font-h1 text-h2 text-white mb-10">Privacy Policy</h1>
        <div className="prose prose-invert prose-slate max-w-none">
          <p className="text-slate-400 leading-relaxed">
            Mitcrux is committed to protecting your personal data. This privacy policy outlines how we collect,
            use, and protect information gathered through our website and services.
          </p>
          <h2 className="font-display font-bold text-white text-xl mt-10 mb-4">Data We Collect</h2>
          <p className="text-slate-400 leading-relaxed">
            We collect only the information you provide directly to us via our contact forms, emails, or
            phone calls. This may include your name, email, company name, and project details.
          </p>
          <h2 className="font-display font-bold text-white text-xl mt-8 mb-4">How We Use Your Data</h2>
          <p className="text-slate-400 leading-relaxed">
            Your data is used solely to respond to your enquiries, deliver our services, and improve your
            experience. We never sell your data to third parties.
          </p>
          <h2 className="font-display font-bold text-white text-xl mt-8 mb-4">Contact</h2>
          <p className="text-slate-400 leading-relaxed">
            For privacy concerns, email us at{" "}
            <a href="mailto:info@mitcrux.com" className="font-medium underline underline-offset-4" style={{ color: "var(--text-accent)" }}>info@mitcrux.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
