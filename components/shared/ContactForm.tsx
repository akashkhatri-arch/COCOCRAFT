"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = "Name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone)) {
      tempErrors.phone = "Enter a valid 10-digit Indian phone number.";
    }
    if (!message.trim()) tempErrors.message = "Message is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate contact form submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("Thank you! Your message has been recorded.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-cream-200 p-8 shadow-sm">
      {success ? (
        <div className="text-center py-8 space-y-4">
          <span className="text-4xl block">📨</span>
          <h3 className="font-serif text-2xl text-choco-950">Message Sent!</h3>
          <p className="text-sm text-choco-600 font-sans max-w-sm mx-auto leading-relaxed">
            Thank you for reaching out. A developer support team member will get back to you shortly (simulated for dev).
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-2.5 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-xs uppercase tracking-wider hover:bg-choco-800 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            disabled={loading}
            placeholder="Your full name"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={loading}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              disabled={loading}
              placeholder="10-digit mobile number"
              required
            />
          </div>
          <Textarea
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={errors.message}
            disabled={loading}
            placeholder="Describe your corporate query or custom chocolate request..."
            required
          />
          <div className="pt-2">
            <Button type="submit" isLoading={loading} className="w-full">
              Send Message
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
