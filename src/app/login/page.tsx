"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth.service";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("tech1@stayfix.hotel");
  const [password, setPassword] = useState<string>("StayFixPass2026!");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await authService.login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid credentials";
      setErrorMessage(message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-canvas p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-brand-border/80 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-dark font-black text-xl text-accent shadow-sm">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">Staff Operations Portal</h1>
          <p className="mt-1 text-xs text-brand-muted">StayFix Hotel Maintenance &amp; Operations</p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-urgency-high-border bg-urgency-high-bg p-3 text-xs font-semibold text-urgency-high-text">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
              Staff Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-brand-border bg-white p-3 text-sm text-brand-dark outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-brand-border bg-white p-3 text-sm text-brand-dark outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-sm hover:bg-accent-hover disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? "Authenticating..." : "Sign In to Maintenance Board"}
          </button>
        </form>

        <div className="mt-6 border-t border-brand-border/40 pt-4 text-center">
          <p className="text-xs text-brand-muted">
            Demo Credentials: <span className="font-mono font-bold text-brand-dark">tech1@stayfix.hotel</span> (Staff) or <span className="font-mono font-bold text-brand-dark">admin@stayfix.hotel</span> (Admin)
          </p>
          <div className="mt-3">
            <Link href="/" className="text-xs font-bold text-accent hover:underline">
              &larr; Back to Guest Portal
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}