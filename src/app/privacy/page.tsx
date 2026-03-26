import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-950 pt-36 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display font-extrabold text-4xl text-white mb-8">Privacy Policy</h1>
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
            <a href="mailto:info@mitcrux.com" className="text-cyan-400 hover:text-cyan-300">info@mitcrux.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
