"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { signupAction } from "@/app/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signupAction(formData);
    if (!res.success) {
      setError(res.error || "Failed to create account.");
      setLoading(false);
      return;
    }

    router.push("/account");
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
                Join COCOCRAFT Club
              </h1>
              <p className="text-xs text-choco-500 font-sans">
                Create an account for personalized chocolate creations, saved addresses, and express re-orders.
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
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-choco-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Elena Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-choco-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-choco-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-choco-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 active:scale-[0.99] disabled:opacity-50 font-montserrat font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-choco-600 font-sans">
              Already have an account?{" "}
              <Link href="/login" className="text-choco-950 font-bold hover:underline font-montserrat">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
