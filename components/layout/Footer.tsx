"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, Mail, MessageCircle, Heart, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

const footerLinks = {
  Shop: [
    { label: "All Chocolates", href: "/products" },
    { label: "Custom Bar Builder", href: "/customize" },
    { label: "Gourmet Gift Boxes", href: "/products?category=gift-boxes" },
    { label: "Wishlist", href: "/wishlist" },
  ],
  About: [
    { label: "Our Story", href: "/about" },
    { label: "Frequently Asked Questions", href: "/faq" },
    { label: "Contact & Concierge", href: "/contact" },
    { label: "Customer Account", href: "/account" },
  ],
  Policies: [
    { label: "Cold-Chain Shipping", href: "/shipping" },
    { label: "Melt-Free & Returns", href: "/returns" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-choco-950 text-cream-100" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded group"
            >
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold-400/40 shrink-0 bg-[#f7f4ed]">
                <Image
                  src="/logo.png"
                  alt={`${siteConfig.brandName} Logo`}
                  fill
                  sizes="44px"
                  className="object-cover scale-105"
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl text-cream-50">{siteConfig.brandName}</span>
                <span className="text-sm font-serif italic text-gold-400">{siteConfig.brandSubtitle}</span>
              </div>
            </Link>
            <p className="text-sm text-cream-200/70 font-sans leading-relaxed max-w-xs">
              Pure couverture artisanal chocolates, handcrafted fresh to order for life&rsquo;s most cherished moments.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a
                href={`https://instagram.com/${siteConfig.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-100/20 text-cream-300 hover:border-gold-500 hover:text-gold-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <Camera className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-100/20 text-cream-300 hover:border-gold-500 hover:text-gold-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                aria-label="Email our chocolatiers"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-100/20 text-cream-300 hover:border-gold-500 hover:text-gold-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-montserrat font-bold text-xs uppercase tracking-widest text-cream-50/50 mb-5">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream-100/70 font-sans hover:text-gold-400 transition-colors focus-visible:outline-none focus-visible:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Banner */}
        <div className="py-8 border-t border-cream-100/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif text-lg font-bold text-cream-50">
              Join the Connoisseurs Circle
            </h4>
            <p className="text-xs text-cream-200/60 font-sans">
              Receive secret festive flavor drops and a 10% welcome coupon.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-montserrat font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Welcome to the circle! Check your inbox for WELCOME10.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-2 w-full md:w-auto max-w-sm">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full md:w-64 px-4 py-2 text-xs rounded-full bg-choco-900 border border-choco-700 text-cream-50 focus:outline-none focus:border-gold-500 font-sans placeholder:text-choco-400"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gold-500 text-choco-950 hover:bg-gold-400 font-montserrat font-bold text-xs tracking-wide transition-colors shrink-0 cursor-pointer"
              >
                Join
              </button>
            </form>
          )}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-cream-100/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-cream-100/40 font-sans">
          <p>© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="h-3 w-3 text-gold-500 fill-gold-500" /> in Bengaluru, India
          </p>
        </div>
      </div>
    </footer>
  );
};
