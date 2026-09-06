import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy | COCOCRAFT Artisanal Chocolates",
  description: "Learn how COCOCRAFT protects your customer privacy, addresses, and chocolate preferences.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 border-b border-cream-200 pb-6">
            <span className="text-[11px] font-montserrat font-bold text-gold-600 uppercase tracking-widest">
              Legal & Transparency
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-choco-950">
              Privacy Policy
            </h1>
            <p className="text-xs text-choco-500 font-sans">
              Last updated: September 2026 · COCOCRAFT Artisanal Confections Private Limited
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-10 space-y-8 text-sm text-choco-800 font-sans leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">1. Information We Collect</h2>
              <p>
                When you visit the COCOCRAFT storefront, create a custom chocolate recipe in our builder, or place an order, we collect essential details to fulfill your order and personalize your experience:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-choco-700">
                <li><strong>Contact Information:</strong> Full name, email address, phone number, and delivery addresses.</li>
                <li><strong>Customization Details:</strong> Inscriptions, personal messages, base chocolate selections, and topping specifications.</li>
                <li><strong>Order History:</strong> Past purchases, transaction references, and saved items in your wishlist.</li>
                <li><strong>Technical Data:</strong> IP address, device type, and session cookies for cart persistence.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">2. How We Use Your Information</h2>
              <p>
                We use your information exclusively for artisanal craft fulfillment, temperature-controlled courier coordination, order tracking updates, and optional newsletter announcements. We do not sell or lease your personal data to third-party advertisers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">3. Cold-Chain Courier Partners</h2>
              <p>
                To deliver our chocolates in pristine, melt-free condition across India, your name, shipping address, and phone number are securely shared with our specialized cold-chain logistics partners (such as BlueDart, Delhivery, and local express temperature-controlled couriers).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">4. Data Security & Payment Safety</h2>
              <p>
                All digital transactions are encrypted via industry-standard TLS protocols. Payment card numbers, UPI credentials, and banking details are processed directly by certified RBI-regulated payment gateways and never stored on COCOCRAFT servers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">5. Contact Our Privacy Officer</h2>
              <p>
                If you have questions about your stored data, account deletion, or cookie preferences, please contact our support desk at{" "}
                <a href={`mailto:${siteConfig.supportEmail}`} className="text-gold-700 underline font-bold">
                  {siteConfig.supportEmail}
                </a>{" "}
                or via WhatsApp at +{siteConfig.whatsappNumber}.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
