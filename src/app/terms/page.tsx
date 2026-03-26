import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-950 pt-36 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display font-extrabold text-4xl text-white mb-8">Terms of Service</h1>
        <div className="space-y-8 text-slate-400 leading-relaxed">
          <p>By engaging Mitcrux for any services, you agree to the following terms.</p>
          <div>
            <h2 className="font-display font-bold text-white text-xl mb-3">Services</h2>
            <p>Mitcrux provides software development, AI automation, design, and related digital services as described in our service packages. All work is delivered as specified in the agreed project scope.</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-xl mb-3">Payment</h2>
            <p>A 50% deposit is required before project commencement. The remaining balance is due upon delivery. Retainer services are billed monthly in advance.</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-xl mb-3">Intellectual Property</h2>
            <p>Upon full payment, all custom code and design assets created for your project are transferred to you. Mitcrux retains the right to include work in our portfolio unless agreed otherwise.</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-xl mb-3">Contact</h2>
            <p>Questions? Reach us at <a href="mailto:info@mitcrux.com" className="text-cyan-400">info@mitcrux.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
