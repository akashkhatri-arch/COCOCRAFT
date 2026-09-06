import Link from "next/link";
import { Sparkles, ArrowRight, Gift } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { Rating } from "@/components/ui/Rating";
import { getProducts, getFAQs, getTestimonials } from "@/lib/data/store";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "COCOCRAFT | Premium Personalised Couverture Chocolates",
  description: "Create your original customized chocolate bars. Pick your Belgian chocolate base, choose from 15+ premium toppings, and add your name. Handcrafted to order.",
  openGraph: {
    title: "COCOCRAFT | Premium Personalised Couverture Chocolates",
    description: "Handcrafted couverture chocolate bars customized with gourmet toppings and personalized dedications. Shipped fresh across India.",
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.brandName,
  },
  twitter: {
    card: "summary_large_image",
    title: "COCOCRAFT | Premium Personalised Couverture Chocolates",
    description: "Create your original customized chocolate bars. Handcrafted to order with pure Belgian couverture.",
  },
};

export default async function Home() {
  const [featuredProducts, faqs, testimonials] = await Promise.all([
    getProducts({ featuredOnly: true }),
    getFAQs(),
    getTestimonials(),
  ]);

  const occasions = [
    { name: "Birthday", slug: "birthday", color: "bg-rose-50" },
    { name: "Anniversary", slug: "anniversary", color: "bg-amber-50" },
    { name: "Wedding", slug: "wedding", color: "bg-orange-50" },
    { name: "Valentine's", slug: "valentines", color: "bg-red-50" },
    { name: "Corporate Gifts", slug: "corporate", color: "bg-blue-50" },
    { name: "Thank You", slug: "thank-you", color: "bg-emerald-50" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 text-choco-950 font-sans">
        
        {/* ── 1. HERO SECTION ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32 flex items-center border-b border-cream-200">
          <div className="absolute inset-0 bg-radial-gradient from-cream-100/40 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-300/30 text-gold-600 text-xs font-montserrat font-bold tracking-widest uppercase">
                <Sparkles className="h-3 w-3" />
                Artisanal Gifting
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-choco-900 tracking-tight leading-tight">
                {siteConfig.tagline}
              </h1>
              <p className="text-base sm:text-lg text-choco-700 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Handcraft your own personalised premium Belgian chocolate bars. Pick your base, select from 15+ rich toppings, and engrave a dedication. Delivered fresh across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
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
                  Shop Chocolates
                </Link>
              </div>
            </div>
            {/* Visual column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-3xl bg-gradient-to-br from-choco-800 to-choco-950 p-6 flex flex-col justify-between shadow-xl text-cream-100 font-serif">
                <div className="flex justify-between items-start border-b border-cream-100/10 pb-4">
                  <div>
                    <p className="text-[10px] font-montserrat font-bold tracking-widest uppercase text-gold-400">
                      Handcrafted Couverture
                    </p>
                    <h3 className="text-xl mt-0.5">Truffle Tales</h3>
                  </div>
                  <span className="text-2xl">🍫</span>
                </div>
                <div className="my-auto py-4 border-b border-cream-100/10 text-center">
                  <p className="text-gold-300 text-[10px] font-montserrat font-bold tracking-widest uppercase mb-1">
                    Custom Creation
                  </p>
                  <p className="text-3xl italic tracking-wide font-normal">Made For You</p>
                </div>
                <div className="flex justify-between items-center text-[10px] font-montserrat tracking-widest uppercase text-cream-200/50">
                  <p>70% dark base</p>
                  <p>Almond & sea salt</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. FEATURED PRODUCTS ────────────────────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-cream-200">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
              Our Curations
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-choco-900 mt-2">
              Made to Be Remembered
            </h2>
            <p className="text-sm text-choco-600 font-sans mt-2">
              Handpicked gourmet chocolate recipes curated by our master chocolatiers.
            </p>
          </div>
          {featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-choco-500 font-sans text-sm">
              Real Supabase data will appear after credentials and migrations are configured.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* ── 3. CUSTOM PROMOTION SECTION ─────────────────────────────────────── */}
        <section className="py-20 bg-choco-900 text-cream-100 border-b border-cream-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual */}
            <div className="lg:col-span-5 flex justify-center order-last lg:order-first">
              <div className="w-64 h-80 sm:w-80 sm:h-96 rounded-2xl border-4 border-gold-300 p-8 flex flex-col justify-between bg-choco-950 shadow-2xl relative">
                <div className="absolute top-2 right-2 text-gold-300 text-3xl">✨</div>
                <div>
                  <h4 className="font-serif text-2xl text-cream-50">BYO Slab</h4>
                  <p className="text-[10px] font-montserrat uppercase text-gold-400 tracking-wider font-bold mt-1">
                    Design-your-own
                  </p>
                </div>
                <div className="space-y-2 border-t border-cream-100/10 pt-4">
                  <p className="text-xs font-sans text-cream-200/80">✓ Dark Belgian Base</p>
                  <p className="text-xs font-sans text-cream-200/80">✓ Salted Pistachios</p>
                  <p className="text-xs font-sans text-cream-200/80">✓ Roasted Hazelnuts</p>
                  <p className="text-xs font-sans text-cream-200/80">✓ Edible Gold Flakes</p>
                </div>
                <div className="border-t border-cream-100/10 pt-4 text-center">
                  <span className="font-montserrat font-bold text-lg text-gold-300">₹399</span>
                </div>
              </div>
            </div>
            {/* Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-400">
                Interactive Customizer
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight text-cream-50">
                Your Chocolate. Your Way.
              </h2>
              <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                Become the chocolatier. Choose from three premium Belgian couverture bases (Creamy Milk, Intense Dark, Velvet White), specify your size modifier, select up to 5 crunchy toppings, and print a custom message on the packaging.
              </p>
              <div className="pt-2">
                <Link
                  href="/customize"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold-400 text-choco-950 hover:bg-gold-300 rounded-full font-montserrat font-bold tracking-wide transition-all shadow-md text-sm"
                >
                  Build Your Chocolate
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS ────────────────────────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-cream-200">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
              The Process
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-choco-900 mt-2">
              Handcrafted in 4 Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "01",
                title: "Choose your chocolate",
                desc: "Select from our premium Belgian couverture milk, dark, or white bases.",
                icon: "🍫",
              },
              {
                num: "02",
                title: "Pick your toppings",
                desc: "Choose up to 5 toppings including roasted nuts, berries, cookies, or 24k gold leaf.",
                icon: "✨",
              },
              {
                num: "03",
                title: "Make it personal",
                desc: "Name your creation and engrave a personal message on the luxury gift sleeve.",
                icon: "✍️",
              },
              {
                num: "04",
                title: "We make & deliver it",
                desc: "Our chefs handcraft, temper, and ship fresh in temperature-controlled cold packaging.",
                icon: "📦",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-cream-200 p-6 space-y-4 hover:shadow-md transition-all hover:-translate-y-1 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl" role="img" aria-hidden="true">{step.icon}</span>
                  <span className="font-serif text-3xl text-gold-300/50 group-hover:text-gold-400 transition-colors select-none">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-choco-900">{step.title}</h3>
                <p className="text-xs text-choco-600 font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. SHOP BY OCCASION ────────────────────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-cream-200">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
              Gifting Occasions
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-choco-900 mt-2">
              Shop by Occasion
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {occasions.map((o) => (
              <Link
                key={o.slug}
                href={`/products?category=${o.slug}`}
                className={`${o.color} border border-cream-200 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all hover:shadow-sm duration-300 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500`}
              >
                <div className="h-10 w-10 mx-auto rounded-full bg-white flex items-center justify-center text-lg shadow-sm mb-3">
                  🍫
                </div>
                <h3 className="font-montserrat font-bold text-xs text-choco-800 tracking-wide">
                  {o.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 6. GIFTING SECTION ──────────────────────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-cream-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl border border-cream-200 p-8 sm:p-12 shadow-sm">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-montserrat font-bold tracking-widest uppercase">
                <Gift className="h-3 w-3" />
                Luxury hampers
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-choco-900 leading-tight">
                Chocolate is better when it means something.
              </h2>
              <p className="text-sm text-choco-700 leading-relaxed font-sans max-w-md">
                Make your gifts unforgettable. Add premium packaging boxes wrapped in gold ribbons, personalized greeting cards, or order branded custom chocolate templates for corporate gifting.
              </p>
              <div className="pt-2">
                <Link
                  href="/products?category=gift-boxes"
                  className="px-8 py-4 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold tracking-wide hover:bg-choco-800 transition-all text-sm"
                >
                  Explore Gifts
                </Link>
              </div>
            </div>
            {/* Visual grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cream-50 border border-cream-100 rounded-2xl p-6 text-center space-y-2">
                <h3 className="font-serif text-lg text-choco-900">Slide Gift Box</h3>
                <p className="text-xs text-choco-500 font-sans">Hardbound gold foil wraps</p>
              </div>
              <div className="bg-cream-50 border border-cream-100 rounded-2xl p-6 text-center space-y-2">
                <h3 className="font-serif text-lg text-choco-900">Custom Greeting</h3>
                <p className="text-xs text-choco-500 font-sans">Handprinted gift message</p>
              </div>
              <div className="bg-cream-50 border border-cream-100 rounded-2xl p-6 text-center col-span-2 space-y-2">
                <h3 className="font-serif text-lg text-choco-900">Corporate Customization</h3>
                <p className="text-xs text-choco-500 font-sans">Custom printed sleeves with corporate logo wraps</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. TESTIMONIALS ────────────────────────────────────────────────── */}
        <section className="py-20 bg-white border-b border-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
                Customer Stories
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-choco-900 mt-2">
                What Chocolate Lovers Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="border border-cream-200 rounded-2xl p-6 bg-cream-50 flex flex-col justify-between">
                  <div>
                    <Rating value={t.rating} size="sm" readOnly className="mb-4" />
                    <p className="text-sm italic text-choco-700 leading-relaxed font-sans mb-6">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>
                  <div className="border-t border-cream-200/50 pt-4">
                    <p className="font-montserrat font-bold text-xs text-choco-950">{t.name}</p>
                    <p className="text-[10px] text-choco-400 font-sans mt-0.5">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FAQ PREVIEW ─────────────────────────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-cream-200">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-choco-900 mt-2">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqAccordion items={faqs.slice(0, 5)} />
          <div className="text-center pt-8">
            <Link
              href="/faq"
              className="font-montserrat font-bold text-xs uppercase tracking-wider text-choco-900 hover:text-choco-700 focus-visible:outline-none focus-visible:underline"
            >
              View All FAQs
            </Link>
          </div>
        </section>

        {/* ── 9. NEWSLETTER ──────────────────────────────────────────────────── */}
        <section className="py-20 bg-cream-100 border-b border-cream-200">
          <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
              The Chocolate Club
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-choco-900 leading-snug">
              Keep it sweet.
            </h2>
            <p className="text-sm text-choco-600 max-w-md mx-auto leading-relaxed">
              Subscribe to receive updates on customizer toppings, exclusive holiday collections, and corporate discounts.
            </p>
            <NewsletterForm />
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
