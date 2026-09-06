import React from "react";
import { Truck, Snowflake, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Cold-Chain Shipping Policy | COCOCRAFT Artisanal Chocolates",
  description: "Learn how COCOCRAFT guarantees 100% melt-free chocolate delivery across India using insulated thermal packaging and dry ice gel packs.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 border-b border-cream-200 pb-6">
            <span className="text-[11px] font-montserrat font-bold text-gold-600 uppercase tracking-widest">
              Delivery Standards
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-choco-950">
              Cold-Chain Shipping & Delivery
            </h1>
            <p className="text-xs text-choco-500 font-sans">
              Melt-Free Freshness Guaranteed across India · Direct from our Bangalore Chocolaterie
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 bg-white rounded-2xl border border-cream-200 shadow-2xs space-y-2">
              <Snowflake className="h-6 w-6 text-gold-600" />
              <h3 className="font-serif font-bold text-choco-950">Thermal Packaging</h3>
              <p className="text-xs text-choco-600 font-sans">
                Insulated reflective silver foil boxes equipped with food-grade frozen gel packs maintain 15–18°C.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-cream-200 shadow-2xs space-y-2">
              <Truck className="h-6 w-6 text-gold-600" />
              <h3 className="font-serif font-bold text-choco-950">Express Air Courier</h3>
              <p className="text-xs text-choco-600 font-sans">
                Shipped via priority air transit with leading logistics partners to minimize transit hours.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-cream-200 shadow-2xs space-y-2">
              <ShieldCheck className="h-6 w-6 text-gold-600" />
              <h3 className="font-serif font-bold text-choco-950">Melt-Free Guarantee</h3>
              <p className="text-xs text-choco-600 font-sans">
                If your pure couverture bar arrives melted, we will replace it immediately free of charge.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-10 space-y-8 text-sm text-choco-800 font-sans leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">Shipping Fees & Free Delivery Threshold</h2>
              <p>
                To provide the highest standard of temperature-controlled packaging, orders below ₹{siteConfig.shippingThreshold} incur a flat delivery charge of ₹{siteConfig.defaultShippingFee}.
              </p>
              <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 text-xs font-montserrat font-bold text-choco-900 flex items-center justify-between">
                <span>All orders above ₹{siteConfig.shippingThreshold} qualify for FREE Express Delivery!</span>
                <span className="text-gold-700">₹0.00</span>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">Estimated Delivery Timelines</h2>
              <ul className="list-disc pl-5 space-y-2 text-xs text-choco-700">
                <li><strong>Bengaluru Metro:</strong> Next-day delivery (or same-day dispatch for morning orders).</li>
                <li><strong>Major Tier 1 Metros (Mumbai, Delhi NCR, Hyderabad, Chennai, Kolkata, Pune):</strong> 2 to 3 business days via priority air courier.</li>
                <li><strong>Rest of India:</strong> 3 to 5 business days depending on pin code accessibility.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-choco-950">Dispatch Schedule</h2>
              <p>
                Because pure couverture chocolate requires careful tempering, custom bars are poured within 24 hours of order receipt. To prevent packages from sitting in non-air-conditioned courier hubs over Sundays, dispatches occur Monday through Friday.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
