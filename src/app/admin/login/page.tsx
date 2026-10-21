"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/admin/Spinner";
import logo from "../../../../public/assets/logo.png";

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin/dashboard");
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/dashboard");
    } catch {
      setError("Invalid credentials. Access denied.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Checking your session" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-12 overflow-hidden">
      {/* Horizon glow, as on the site hero */}
      <div className="horizon" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg" aria-label="Mitcrux website">
            <Image src={logo} alt="" sizes="44px" className="w-11 h-auto" priority />
            <span className="font-display font-extrabold text-2xl tracking-tight">
              <span style={{ color: "var(--text-primary)" }}>MIT</span>
              <span className="text-gradient">CRUX</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-panel !rounded-3xl p-7 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-[var(--glass-border)] flex items-center justify-center mx-auto mb-4 shadow-[inset_0_1px_0_var(--glass-highlight)]">
              <Lock className="w-5 h-5 text-cyan-300" aria-hidden="true" />
            </div>
            <h1 className="font-h1 text-2xl tracking-tight">Admin access</h1>
            <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>Sign in to manage enquiries</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" aria-busy={submitting}>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-email" className="field-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mitcrux.com"
                  required
                  className="field !pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="field-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="field !pl-10 !pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:text-[var(--text-primary)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-400/30">
                <AlertCircle className="w-4 h-4 text-red-300 shrink-0" aria-hidden="true" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm rounded-lg transition-colors hover:text-[var(--text-primary)]"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
