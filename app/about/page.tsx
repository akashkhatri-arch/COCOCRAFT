import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About ${siteConfig.brandName} | Our Story & Craft`,
  description:
    "Learn about COCOCRAFT's journey — our commitment to premium Belgian couverture, handcrafted personalization, and premium gifting in India.",
  openGraph: {
    title: `About ${siteConfig.brandName} | Our Story & Craft`,
    description: "Premium handcrafted chocolate bars made with Belgian couverture and delivered fresh across India.",
    type: "website",
  },
};

const values = [
  {
    icon: "🍫",
    title: "Belgian Couverture",
    body: "We source pure Belgian couverture chocolate — high-cocoa-butter, zero vegetable-fat — delivering that glossy snap and melt-in-mouth luxury that mass-market compound bars can never replicate.",
  },
  {
    icon: "🎨",
    title: "Made to Order",
    body: "Unlike industrial brands producing stock bars months ahead, every COCOCRAFT bar is cast individually after your order. That means fresh chocolate, fresh toppings, and packaging printed with your name.",
  },
  {
    icon: "🎁",
    title: "Gift-First Design",
    body: "Every detail — the matte chocolate-brown box, the gold foil lettering, the personalised card — is intentionally premium so your gift arrives feeling like an editorial luxury product.",
  },
  {
    icon: "🔬",
    title: "Traceable Ingredients",
    body: "We clearly list every ingredient and allergen. Our toppings — Iranian pistachios, Turkish hazelnuts, 24k edible gold — are sourced from traceable specialty suppliers.",
  },
];

const team = [
  { name: "Aisha Khanna", role: "Founder & Head Chocolatier", note: "Trained at École Chocolat, Montréal." },
  { name: "Rahul Bose", role: "Operations & Gifting", note: "10+ years in premium FMCG." },
  { name: "Meera Singh", role: "Design & Packaging", note: "Specialises in luxury product identities." },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 text-choco-950 font-sans pt-28 pb-20">

        {/* ── PAGE HEADER ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <Breadcrumb items={[{ label: "About Us" }]} className="mb-6" />
          <div className="text-center space-y-4">
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
              Our Story
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-choco-900 leading-tight">
              Crafting Original<br className="hidden sm:inline" /> Chocolate Moments.
            </h1>
            <p className="text-base sm:text-lg text-choco-600 font-sans max-w-2xl mx-auto leading-relaxed">
              At COCOCRAFT, we believe chocolate is more than a sweet treat — it is a personal medium for self-expression, gift-giving, and shared celebration. Every bar we make is a one-of-a-kind creation.
            </p>
          </div>
        </section>

        {/* ── ORIGIN STORY ── */}
        <section className="bg-choco-900 text-cream-100 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-400">
                How We Started
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-cream-50 leading-tight">
                Born from a Birthday Disaster
              </h2>
              <p className="text-sm text-cream-200/80 leading-relaxed font-sans">
                It started in 2022 when our founder Aisha couldn&apos;t find a meaningful, premium chocolate gift for her mother&apos;s 60th birthday. Everything she found was either generic shelf product or an overpriced import with no personal touch. So she made one herself — crafting a Belgian dark bar with rose petals and sea salt, packaged in a handwritten gold-foil box.
              </p>
              <p className="text-sm text-cream-200/80 leading-relaxed font-sans">
                The response was overwhelming. Within weeks, friends were commissioning custom bars for weddings, anniversaries, and corporate events. COCOCRAFT was born out of that demand — a desire to make premium personalised chocolate accessible to everyone in India.
              </p>
            </div>
            {/* Decorative card */}
            <div className="flex justify-center">
              <div className="w-64 h-72 rounded-2xl bg-gradient-to-br from-choco-800 to-choco-950 border border-gold-400/30 p-7 flex flex-col justify-between text-cream-100 font-serif shadow-2xl">
                <div>
                  <p className="text-[9px] font-montserrat font-bold tracking-widest uppercase text-gold-400">Est. 2022</p>
                  <h3 className="text-2xl mt-1">COCOCRAFT</h3>
                </div>
                <div className="space-y-2 border-t border-cream-100/10 pt-4 font-sans text-xs text-cream-200/60">
                  <p>🍫 Premium Belgian Couverture</p>
                  <p>✨ Handcrafted to Order</p>
                  <p>📦 Delivered Across India</p>
                  <p>⭐ 4.9 / 5 Customer Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
              What Makes Us Different
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-choco-900 mt-2">
              The COCOCRAFT Standard
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-cream-200 p-8 space-y-3 hover:shadow-md transition-shadow"
              >
                <span className="text-3xl" role="img" aria-hidden="true">{v.icon}</span>
                <h3 className="font-serif text-xl text-choco-900">{v.title}</h3>
                <p className="text-sm text-choco-600 font-sans leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="bg-cream-100/60 py-20 border-y border-cream-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
                Our People
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-choco-900 mt-2">
                The Artisans Behind Every Bar
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl border border-cream-200 p-6 text-center space-y-2 hover:shadow-sm transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center text-3xl mx-auto">
                    👤
                  </div>
                  <h3 className="font-serif text-lg text-choco-900">{member.name}</h3>
                  <p className="text-xs font-montserrat font-bold uppercase tracking-wider text-gold-600">
                    {member.role}
                  </p>
                  <p className="text-xs text-choco-500 font-sans">{member.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-choco-900 leading-tight mb-4">
            Ready to create your chocolate?
          </h2>
          <p className="text-sm text-choco-600 font-sans mb-8 max-w-xl mx-auto leading-relaxed">
            Whether it&apos;s for a birthday, a wedding, a thank-you, or just because — design a personalised bar that tells your story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/customize"
              className="px-8 py-4 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold tracking-wide hover:bg-choco-800 transition-all shadow-md text-sm text-center"
            >
              Create Your Chocolate
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 border-2 border-choco-900 text-choco-900 rounded-full font-montserrat font-bold tracking-wide hover:bg-cream-100 transition-all text-sm text-center"
            >
              Shop All Chocolates
            </Link>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
