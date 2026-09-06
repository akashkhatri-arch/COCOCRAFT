"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate API request - email connectivity will be wired later
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("Welcome to the Chocolate Club! Check your inbox soon.");
      setEmail("");
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto">
      {success ? (
        <div className="bg-cream-100/50 border border-cream-200/50 rounded-2xl p-6 text-center">
          <span className="text-3xl block mb-2">🎉</span>
          <h4 className="font-serif text-lg text-choco-950 mb-1">You&apos;re in!</h4>
          <p className="text-xs text-choco-600 font-sans">
            Thank you for joining. We&apos;ve sent a confirmation message to your email (simulated for dev).
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full text-left">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="bg-white/80 border-cream-200"
              disabled={loading}
              aria-label="Email address"
            />
          </div>
          <Button type="submit" isLoading={loading} className="w-full sm:w-auto h-11">
            Join Club
          </Button>
        </form>
      )}
    </div>
  );
};
