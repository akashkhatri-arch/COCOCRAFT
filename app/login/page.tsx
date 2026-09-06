"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, UserCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await loginAction({ email, password });
    if (!res.success) {
      setError(res.error || "Login failed. Please check credentials.");
      setLoading(false);
      return;
    }

    if (res.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/account");
    }
  };

  const handleQuickDemoLogin = async (type: "customer" | "admin") => {
    setError(null);
    setLoading(true);
    const res = await loginAction({
      email: type === "admin" ? "admin@cococraft.in" : "customer@cococraft.in",
      isDemoAdmin: type === "admin",
      isDemoCustomer: type === "customer",
    });

    if (res.success) {
      if (type === "admin") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-20 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-2xl block">🍫</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-choco-950">
                Welcome to COCOCRAFT
              </h1>
              <p className="text-xs text-choco-500 font-sans">
                Sign in to manage your custom recipes, orders, and addresses.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-choco-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-montserrat font-bold text-choco-900">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-montserrat text-gold-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-choco-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 active:scale-[0.99] disabled:opacity-50 font-montserrat font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Personas */}
            <div className="pt-3 border-t border-cream-100 space-y-2.5">
              <span className="text-[11px] font-montserrat text-choco-400 uppercase tracking-wider block text-center font-bold">
                Quick 1-Click Demo Login
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("customer")}
                  disabled={loading}
                  className="p-2 rounded-xl border border-cream-200 hover:border-gold-400 bg-cream-50/60 hover:bg-gold-50/40 text-choco-800 text-[11px] font-montserrat font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserCheck className="h-3.5 w-3.5 text-gold-600" />
                  <span>Customer Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("admin")}
                  disabled={loading}
                  className="p-2 rounded-xl border border-cream-200 hover:border-gold-400 bg-cream-50/60 hover:bg-gold-50/40 text-choco-800 text-[11px] font-montserrat font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-choco-900" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2 text-xs text-choco-600 font-sans">
              Don&rsquo;t have an account yet?{" "}
              <Link href="/signup" className="text-choco-950 font-bold hover:underline font-montserrat">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
