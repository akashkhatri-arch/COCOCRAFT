/**
 * /customize — Server Component page for the COCOCRAFT chocolate builder.
 *
 * Supports:
 *   /customize                        — picks the first customizable product
 *   /customize?product=<slug>         — preloads the specified product
 *
 * All data fetching happens server-side.
 * The CustomizerShell client component receives pre-fetched data as props.
 */

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CustomizerShell } from "@/components/customizer/CustomizerShell";
import {
  getProductBySlug,
  getProducts,
  getChocolateTypes,
  getToppings,
  getAddons,
} from "@/lib/data/store";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

interface CustomizePageProps {
  searchParams: Promise<{ product?: string }>;
}

export async function generateMetadata({
  searchParams,
}: CustomizePageProps): Promise<Metadata> {
  const { product } = await searchParams;
  const title = product
    ? `Customize ${product.replace(/-/g, " ")} | ${siteConfig.brandName}`
    : `Design Your Chocolate | ${siteConfig.brandName}`;
  return {
    title,
    description:
      "Build your personalized premium chocolate bar — choose your base, toppings, and message. Made to order with Belgian couverture.",
  };
}

export default async function CustomizePage({ searchParams }: CustomizePageProps) {
  const { product: productSlug } = await searchParams;

  // ── 1. Resolve the product ────────────────────────────────────────────────
  let resolvedSlug = productSlug;

  if (!resolvedSlug) {
    // No slug — find first available customizable product
    const customizableProducts = await getProducts({
      customizableOnly: true,
      inStockOnly: true,
    });
    if (customizableProducts.length === 0) {
      // No customizable products in DB — show error page
      return (
        <>
          <Header />
          <main className="min-h-screen bg-cream-50 pt-28 pb-20 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <span className="text-5xl" role="img" aria-hidden="true">😔</span>
              <h1 className="font-serif text-3xl text-choco-900 mt-4 mb-3">
                No customizable products
              </h1>
              <p className="text-sm text-choco-500 font-sans mb-6">
                Our custom chocolate builder is temporarily unavailable. Please check back soon or browse our existing collection.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-sm tracking-wide hover:bg-choco-800 transition-all"
              >
                Browse All Chocolates
              </Link>
            </div>
          </main>
          <Footer />
        </>
      );
    }
    resolvedSlug = customizableProducts[0].slug;
    // If multiple, just redirect to the canonical URL for cleanliness
  }

  // ── 2. Fetch product data ─────────────────────────────────────────────────
  const productData = await getProductBySlug(resolvedSlug);

  if (!productData) {
    notFound();
  }

  const { product, variants } = productData;

  // ── 3. Validate customizability & stock ───────────────────────────────────
  if (!product.is_customizable) {
    // Not a customizable product — redirect to its product detail page
    redirect(`/products/${product.slug}`);
  }

  if (!product.active) {
    notFound();
  }

  // ── 4. Fetch configuration data in parallel ───────────────────────────────
  const [chocolateTypes, toppings, addons] = await Promise.all([
    getChocolateTypes(),
    getToppings(),
    getAddons(),
  ]);

  // ── 5. Handle empty chocolate types (configuration issue) ─────────────────
  if (chocolateTypes.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-cream-50 pt-28 pb-20 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <span className="text-5xl" role="img" aria-hidden="true">🍫</span>
            <h1 className="font-serif text-2xl text-choco-900 mt-4 mb-3">
              Builder temporarily unavailable
            </h1>
            <p className="text-sm text-choco-500 font-sans mb-6">
              Our chocolate configuration is being updated. Please try again shortly.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-sm tracking-wide hover:bg-choco-800 transition-all"
            >
              Browse All Chocolates
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 pt-24 pb-20">
        {/* ── Page header ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-cream-200 mb-0">
          <Breadcrumb
            items={[
              { label: "Shop", href: "/products" },
              { label: "Design Your Chocolate" },
            ]}
            className="mb-3"
          />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
                Chocolate Builder
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-choco-900 mt-0.5">
                {product.name}
              </h1>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-400">
                Starting from
              </p>
              <p className="font-montserrat font-black text-choco-900 text-2xl">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(product.base_price)}
              </p>
            </div>
          </div>

          {/* Out of stock banner */}
          {isOutOfStock && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-sans">
              ⚠️ This product is currently out of stock and cannot be customized.{" "}
              <Link href="/products" className="underline font-semibold">
                View other chocolates
              </Link>
            </div>
          )}
        </div>

        {/* ── Customizer ── */}
        {isOutOfStock ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-sm tracking-wide hover:bg-choco-800 transition-all"
            >
              Browse All Chocolates
            </Link>
          </div>
        ) : (
          <CustomizerShell
            product={product}
            variants={variants}
            chocolateTypes={chocolateTypes}
            toppings={toppings}
            addons={addons}
            productSlug={resolvedSlug}
          />
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
