import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service | COCOCRAFT Artisanal Chocolates",
  description: "Terms and conditions governing custom chocolate bar creation, order fulfillment, and delivery at COCOCRAFT.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 border-b border-cream-200 pb-6">
            <span className="text-[11px] font-montserrat font-bold text-gold-600 uppercase tracking-widest">
              Terms & Conditions
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-choco-950">
              Terms of Service
            </h1>
            <p className="text-xs text-choco-500 font-sans">
              Effective as of September 2026 · COCOCRAFT Artisanal Confections Private Limited
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-10 space-y-8 text-sm text-choco-800 font-sans leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">1. Acceptance of Terms</h2>
              <p>
                By accessing or placing an order through the COCOCRAFT website, you agree to be bound by these Terms of Service, our Privacy Policy, and our Cold-Chain Shipping guidelines.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">2. Custom Chocolate Creations</h2>
              <p>
                Each custom chocolate bar designed in our 6-step interactive builder is made fresh to order. Because our confections are personalized with bespoke inscriptions and perishable food ingredients, orders cannot be cancelled or modified once chocolate tempering and molding have commenced.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">3. Ingredients, Allergens & Quality</h2>
              <p>
                All COCOCRAFT chocolate bars are crafted with 100% pure cocoa butter and zero hydrogenated vegetable fats. Our facility handles tree nuts (almonds, pistachios, hazelnuts), milk, and soy. Detailed allergen statements are available on product descriptions and packaging labels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">4. Pricing & Promotions</h2>
              <p>
                All prices are stated in Indian Rupees (INR) and are inclusive of applicable GST unless noted otherwise. COCOCRAFT reserves the right to modify promotional codes and shipping rates at its discretion.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">5. Limitation of Liability</h2>
              <p>
                While we take every precaution to ensure rapid cold-chain express delivery, delivery dates are estimates subject to courier operations, adverse weather, or regional restrictions.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
