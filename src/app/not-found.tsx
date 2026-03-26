import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlowOrb, DotGrid } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6" style={{ background: "var(--bg-page)" }}>
      <DotGrid className="opacity-30" />
      <GlowOrb color="brand" size="xl" className="top-0 left-1/4 opacity-[0.08]" />

      <div className="relative z-10">
        <p className="font-mono text-8xl font-extrabold text-gradient mb-4">404</p>
        <h1 className="font-display font-extrabold text-3xl mb-4" style={{ color: "var(--text-primary)" }}>Page not found</h1>
        <p className="text-slate-400 mb-10 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-primary px-7 py-3.5 group">
          Back to Home
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
