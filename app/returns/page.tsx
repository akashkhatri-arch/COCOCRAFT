import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Return & Melt-Free Policy | COCOCRAFT Artisanal Chocolates",
  description: "Our melt-free guarantee, replacement guidelines, and customer satisfaction policies for artisanal confectionery.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 border-b border-cream-200 pb-6">
            <span className="text-[11px] font-montserrat font-bold text-gold-600 uppercase tracking-widest">
              Satisfaction Promise
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-choco-950">
              Return & Replacement Policy
            </h1>
            <p className="text-xs text-choco-500 font-sans">
              100% Quality & Melt-Free Guarantee · COCOCRAFT Artisanal Chocolates
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-10 space-y-8 text-sm text-choco-800 font-sans leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">Our Melt-Free Commitment</h2>
              <p>
                We believe gourmet chocolate should reach you in the exact condition it left our chocolaterie. If your package arrives damaged, compromised, or melted due to transit delays, we will ship a complimentary replacement or issue a full refund without hassle.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">How to Request a Replacement</h2>
              <p>
                Since chocolate is a perishable gourmet product, we ask that you inspect your package upon delivery:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-choco-700">
                <li>Take a photo or short video of the package exterior and affected chocolate bars within <strong>24 hours</strong> of receipt.</li>
                <li>Send the photos along with your Order Reference Number to our WhatsApp support at <strong>+{siteConfig.whatsappNumber}</strong> or email <strong>{siteConfig.supportEmail}</strong>.</li>
                <li>Our care team will review and approve a priority replacement within 4 business hours.</li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">Perishable Food Nature & Custom Inscriptions</h2>
              <p>
                Because custom chocolate bars are engraved with specific personal names and crafted to individual taste, we cannot accept physical returns of chocolates once delivered intact. If you are dissatisfied with your flavor balance or topping selection, contact us and we will gladly offer store credit toward your next craft session.
              </p>
            </section>

            <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-choco-950 text-base">Have an issue with your delivery?</h3>
                <p className="text-xs text-choco-600 font-sans">Our customer care chocolatiers are ready to assist you.</p>
              </div>
              <Link
                href="/contact"
                className="px-6 py-2.5 rounded-full bg-choco-900 text-cream-50 text-xs font-montserrat font-bold hover:bg-choco-800 transition-colors shrink-0"
              >
                Contact Support Desk
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
