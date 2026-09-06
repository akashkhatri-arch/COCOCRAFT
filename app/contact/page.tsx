"use client";

import { useState, FormEvent } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Link from "next/link";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@cococraft.in",
    href: "mailto:hello@cococraft.in",
    description: "We respond within 2 business hours",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+91 99999 99999",
    href: "https://wa.me/919999999999",
    description: "Fastest response — chat with us now",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Bandra West, Mumbai – 400050",
    href: "https://maps.google.com",
    description: "Pickup available by appointment",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat, 10 AM – 7 PM IST",
    href: null,
    description: "Closed on national holidays",
  },
];

const enquiryTypes = [
  "General Enquiry",
  "Custom Order",
  "Corporate Gifting",
  "Wedding Favours",
  "Damaged Order",
  "Partnership",
];

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("loading");

    // Simulate async send (Phase 5 will wire to a real endpoint/email service)
    await new Promise((r) => setTimeout(r, 1200));
    setFormStatus("success");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 text-choco-950 font-sans pt-28 pb-20">

        {/* ── PAGE HEADER ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 text-center">
          <Breadcrumb items={[{ label: "Contact" }]} className="mb-6 justify-center" />
          <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
            Reach Out
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-choco-900 mt-2 mb-4">
            We&apos;d Love to Hear<br className="hidden sm:inline" /> from You
          </h1>
          <p className="text-sm text-choco-600 max-w-xl mx-auto leading-relaxed">
            Questions about a custom order? Corporate gifting quote? Or just want to say hi? Our team is here for you.
          </p>
        </section>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Contact Info Panel ── */}
          <aside className="lg:col-span-2 space-y-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const content = (
                <div
                  key={item.label}
                  className="flex gap-4 p-5 bg-white rounded-2xl border border-cream-200 hover:border-gold-300 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-50 transition-colors">
                    <Icon className="h-5 w-5 text-choco-700" />
                  </div>
                  <div>
                    <p className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
                      {item.label}
                    </p>
                    <p className="font-sans font-semibold text-sm text-choco-900 mt-0.5">
                      {item.value}
                    </p>
                    <p className="text-xs text-choco-400 font-sans mt-0.5">{item.description}</p>
                  </div>
                </div>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}

            {/* Quick links */}
            <div className="bg-choco-900 text-cream-100 rounded-2xl p-6 space-y-3 mt-2">
              <p className="font-montserrat font-bold text-xs uppercase tracking-widest text-gold-400">
                Quick Links
              </p>
              <ul className="space-y-2 font-sans text-sm">
                {[
                  { label: "FAQs", href: "/faq" },
                  { label: "Custom Chocolates", href: "/customize" },
                  { label: "Corporate Gifting", href: "/products?category=gifts" },
                  { label: "Track My Order", href: "/orders" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-2 text-cream-200/80 hover:text-gold-400 transition-colors"
                    >
                      <span className="text-gold-400">→</span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Contact Form ── */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-cream-200 p-8 sm:p-10">
            {formStatus === "success" ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h2 className="font-serif text-2xl text-choco-900">Message Sent!</h2>
                <p className="text-sm text-choco-500 font-sans max-w-xs leading-relaxed">
                  Thank you for reaching out. Our team will get back to you within a few hours.
                </p>
                <button
                  onClick={() => {
                    setFormStatus("idle");
                    setFormData({ name: "", email: "", phone: "", enquiryType: "", message: "" });
                  }}
                  className="mt-4 px-6 py-2.5 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-sm tracking-wide hover:bg-choco-800 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl text-choco-900">Send a Message</h2>
                  <p className="text-xs text-choco-500 font-sans mt-1">
                    All fields marked <span className="text-rose-500">*</span> are required.
                  </p>
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-500 mb-1.5">
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Aisha Khanna"
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-choco-900 text-sm font-sans placeholder:text-choco-300 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-500 mb-1.5">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-choco-900 text-sm font-sans placeholder:text-choco-300 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400 transition-all"
                    />
                  </div>
                </div>

                {/* Phone + Enquiry Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-500 mb-1.5">
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-choco-900 text-sm font-sans placeholder:text-choco-300 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-enquiry" className="block text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-500 mb-1.5">
                      Enquiry Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="contact-enquiry"
                      name="enquiryType"
                      required
                      value={formData.enquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-choco-900 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400 transition-all"
                    >
                      <option value="">Select a topic…</option>
                      {enquiryTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-500 mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your order, question, or idea…"
                    className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-choco-900 text-sm font-sans placeholder:text-choco-300 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400 transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  id="contact-submit"
                  type="submit"
                  disabled={formStatus === "loading"}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-sm tracking-wide hover:bg-choco-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {formStatus === "loading" ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-cream-100/30 border-t-cream-50 rounded-full" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
