"use client";

import { useState, useId } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const FAQ_GROUPS = [
  {
    category: "Orders & Customization",
    items: [
      {
        q: "How do I customize a chocolate bar?",
        a: "Choose any bar from our store and click 'Customize This Chocolate'. You can then select the chocolate type, toppings, packaging, and a personalized message. Once designed, we handcraft your bar within 24–48 hours.",
      },
      {
        q: "Can I use my own design or logo on the packaging?",
        a: "Yes! For corporate and bulk orders (5+ bars), we can incorporate your brand logo, custom colour palette, and completely bespoke packaging. Email us at hello@cococraft.in or WhatsApp us to discuss.",
      },
      {
        q: "What's the minimum order quantity for custom bars?",
        a: "A single customized bar is available with a minimum order of 1. For corporate/event orders at discounted rates, the minimum is typically 10 bars.",
      },
      {
        q: "Can I preview my design before purchasing?",
        a: "Our live configurator gives you a real-time visual preview as you design. We also send a confirmation email with your design summary before we begin crafting.",
      },
      {
        q: "Do you accept last-minute orders?",
        a: "We do our best! Same-day dispatch is available for select in-stock bars in major metro areas if ordered before 10 AM IST. Custom bars require a minimum 24-hour lead time.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        q: "Do you ship across India?",
        a: "Yes. We ship pan-India via temperature-controlled express courier to maintain chocolate quality. Delivery typically takes 1–3 days depending on your city.",
      },
      {
        q: "How is chocolate kept fresh during shipping?",
        a: "We use eco-friendly insulated liners and thermal packs in all shipments. Our chocolates are also sealed in food-grade nitrogen-flushed packs to preserve freshness and bloom.",
      },
      {
        q: "Do you ship internationally?",
        a: "We currently ship within India only. International shipping is on our roadmap — sign up for our newsletter to be notified when it launches.",
      },
      {
        q: "What if my chocolate arrives melted or damaged?",
        a: "We guarantee safe delivery. If your order arrives damaged due to courier handling, photograph the package and contents and contact us within 24 hours at hello@cococraft.in. We'll reship at no charge.",
      },
    ],
  },
  {
    category: "Ingredients & Allergies",
    items: [
      {
        q: "What type of chocolate do you use?",
        a: "We exclusively use premium Belgian couverture chocolate — high cocoa-butter content, free from vegetable fats. This gives our bars the distinctive glossy finish, clean snap, and creamy melt that compound chocolates cannot replicate.",
      },
      {
        q: "Are your products vegan-friendly?",
        a: "Our dark chocolate bars (70%+ cocoa) are vegan. Milk and white chocolate bars contain dairy. Any bar can be requested with a vegan base — just select 'Dark' in the configurator and choose dairy-free toppings.",
      },
      {
        q: "Do your products contain nuts?",
        a: "Many of our toppings include nuts (pistachios, almonds, hazelnuts). Even nut-free variants are produced in a kitchen that handles nuts, so we cannot guarantee zero cross-contamination. Full ingredient and allergen information is listed on every product page.",
      },
      {
        q: "Are your ingredients traceable?",
        a: "Yes. We work only with suppliers who can provide provenance documentation. Our Belgian couverture is Rainforest Alliance certified and our specialty toppings (Iranian pistachios, Turkish figs, etc.) are sourced from traceable importers.",
      },
    ],
  },
  {
    category: "Payments & Returns",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, and net banking via Razorpay — India's most trusted payment gateway. All payments are secured with 256-bit SSL encryption.",
      },
      {
        q: "What is your return or refund policy?",
        a: "Due to the perishable and custom-made nature of our products, we cannot accept returns. However, if your order is incorrect, damaged, or fails our quality standard, we will immediately reship or refund — no questions asked.",
      },
      {
        q: "Can I cancel an order?",
        a: "You can cancel a custom order within 2 hours of placing it if production hasn't begun. Standard in-stock orders can be cancelled before dispatch. Contact us immediately at hello@cococraft.in or via WhatsApp.",
      },
    ],
  },
  {
    category: "Gifting & Corporate",
    items: [
      {
        q: "Do you offer corporate gifting programs?",
        a: "Absolutely. We work with companies across India to create branded gift boxes, custom flavour profiles, and bulk ordering portals. Contact us at corporate@cococraft.in for a bespoke proposal.",
      },
      {
        q: "Can I include a personalised message with my gift?",
        a: "Yes — every order includes a complimentary printed message card. Premium handwritten cards on gold-bordered paper are also available as an add-on during checkout.",
      },
      {
        q: "Do you offer wedding favours?",
        a: "We specialise in weddings! From mehendi favours to reception gifts, our team works with you to design chocolates that match your theme, colour palette, and guest count. Get in touch 4–6 weeks before your event for best availability.",
      },
    ],
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-cream-200 last:border-b-0">
      <button
        id={`faq-btn-${id}`}
        aria-expanded={open}
        aria-controls={`faq-panel-${id}`}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="font-sans text-sm font-semibold text-choco-900 group-hover:text-choco-700 transition-colors leading-snug">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-choco-400 flex-shrink-0 mt-0.5 transition-transform duration-200",
            open && "rotate-180 text-choco-700"
          )}
        />
      </button>
      <div
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-btn-${id}`}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-[500px] opacity-100 pb-5" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-sm text-choco-600 font-sans leading-relaxed pr-6">{answer}</p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 text-choco-950 font-sans pt-28 pb-20">

        {/* ── PAGE HEADER ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 text-center">
          <Breadcrumb items={[{ label: "FAQs" }]} className="mb-6 justify-center" />
          <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
            Help Centre
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-choco-900 mt-2 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-choco-600 max-w-xl mx-auto leading-relaxed">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="text-gold-600 underline hover:text-gold-700 font-semibold">
              Contact us
            </Link>{" "}
            and our team will respond within a few hours.
          </p>
        </section>

        {/* ── FAQ GROUPS ── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {FAQ_GROUPS.map((group) => (
            <section key={group.category} className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
              {/* Group header */}
              <div className="px-8 py-4 border-b border-cream-100 bg-cream-50">
                <h2 className="font-montserrat font-bold text-xs uppercase tracking-widest text-gold-600">
                  {group.category}
                </h2>
              </div>
              {/* Items */}
              <div className="px-8">
                {group.items.map((item) => (
                  <FaqItem key={`${group.category}-${item.q}`} question={item.q} answer={item.a} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── CTA ── */}
        <section className="mt-20 text-center max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-choco-900 rounded-3xl px-8 py-12 text-cream-50">
            <h2 className="font-serif text-2xl sm:text-3xl mb-3 text-cream-50">
              Still have questions?
            </h2>
            <p className="text-sm text-cream-200/70 mb-6 font-sans leading-relaxed">
              Our team is available Monday to Saturday, 10 AM – 7 PM IST. We usually respond within 2 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="px-7 py-3 bg-gold-500 text-choco-950 rounded-full font-montserrat font-bold text-sm tracking-wide hover:bg-gold-400 transition-colors"
              >
                Send a Message
              </Link>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 border border-cream-200/30 text-cream-100 rounded-full font-montserrat font-bold text-sm tracking-wide hover:bg-choco-800 transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
