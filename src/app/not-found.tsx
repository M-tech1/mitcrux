import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6">
      <div className="absolute inset-0 bg-ambient" aria-hidden="true" />

      <div className="relative z-10 anim-rise">
        <Mascot pose="idle" className="w-32 md:w-40 mx-auto mb-2" />
        <p className="font-display text-7xl md:text-8xl font-extrabold text-gradient mb-4 tracking-tight" aria-hidden="true">404</p>
        <h1 className="font-h1 text-h3 mb-4" style={{ color: "var(--text-primary)" }}>Page not found</h1>
        <p className="mb-10 max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary px-7 py-3.5 group">
          Back to Home
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
