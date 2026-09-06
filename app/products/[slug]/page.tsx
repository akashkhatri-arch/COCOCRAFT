import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductDetailActions } from "@/components/products/ProductDetailActions";
import { ProductSpecAccordion } from "@/components/products/ProductSpecAccordion";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductReviews } from "@/components/products/ProductReviews";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { getProductBySlug, getProducts, getCategories } from "@/lib/data/store";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) return { title: "Product Not Found | COCOCRAFT" };

  const { product } = data;
  const title = `${product.name} | COCOCRAFT Premium Chocolates`;
  const description = product.short_description || product.description || "Premium handcrafted Belgian couverture chocolate.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: siteConfig.brandName,
      ...(product.main_image ? { images: [{ url: product.main_image, alt: product.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data) {
    notFound();
  }

  const { product, variants, images } = data;

  // Fetch categories and related products
  const categories = await getCategories();
  const productCategory = categories.find((c) => c.id === product.category_id);
  const categoryName = productCategory?.name || "Chocolates";
  const categorySlug = productCategory?.slug || "";

  const allCategoryProducts = await getProducts({
    categoryId: product.category_id || undefined,
  });
  const relatedProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const discount =
    product.compare_at_price && product.compare_at_price > product.base_price
      ? Math.round(
          ((product.compare_at_price - product.base_price) / product.compare_at_price) * 100
        )
      : null;

  const isInStock = product.stock_quantity > 0;

  // Product structured data (JSON-LD)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: siteConfig.brandName },
    offers: {
      "@type": "Offer",
      price: product.base_price,
      priceCurrency: "INR",
      availability: isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteConfig.brandName },
    },
    ...(product.main_image ? { image: product.main_image } : {}),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Header />
      <main className="min-h-screen bg-cream-50 text-choco-950 font-sans pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Shop", href: "/products" },
              { label: categoryName, href: `/products?category=${categorySlug}` },
              { label: product.name },
            ]}
            className="mb-8"
          />

          {/* Main 2-col Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">

            {/* ── Gallery Column ── */}
            <div>
              <ProductImageGallery images={images} defaultImageAlt={product.name} />
            </div>

            {/* ── Info Column ── */}
            <div className="space-y-5">

              {/* Badges row */}
              <div className="flex flex-wrap gap-2">
                {product.featured && <Badge variant="gold">Featured</Badge>}
                {product.is_customizable && (
                  <Badge variant="default">Customizable</Badge>
                )}
                {discount && <Badge variant="error">Save {discount}%</Badge>}
                {!isInStock && <Badge variant="error">Out of Stock</Badge>}
                {isInStock && product.stock_quantity <= 10 && (
                  <Badge variant="error">Only {product.stock_quantity} left</Badge>
                )}
              </div>

              {/* Category label + Title */}
              <div>
                <p className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600 mb-1">
                  {categoryName}
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl text-choco-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating row */}
              <div className="flex items-center gap-2">
                <Rating value={4.5} size="sm" readOnly />
                <span className="text-xs text-choco-400 font-sans">(12 customer reviews)</span>
              </div>

              {/* Short description */}
              {product.short_description && (
                <p className="text-sm text-choco-700 leading-relaxed font-sans border-b border-cream-200 pb-4">
                  {product.short_description}
                </p>
              )}

              {/* Full description */}
              {product.description && product.description !== product.short_description && (
                <p className="text-sm text-choco-600 leading-relaxed font-sans">
                  {product.description}
                </p>
              )}

              {/* Meta info (weight, shelf life) */}
              <div className="flex flex-wrap gap-4 text-xs text-choco-500 font-sans border-b border-cream-200 pb-4">
                {product.weight && (
                  <span className="flex items-center gap-1">
                    <span className="text-choco-400">⚖</span>
                    {product.weight}g
                  </span>
                )}
                {product.shelf_life && (
                  <span className="flex items-center gap-1">
                    <span className="text-choco-400">⏱</span>
                    {product.shelf_life} shelf life
                  </span>
                )}
                {product.stock_quantity > 0 && (
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <span>✓</span>
                    In stock
                  </span>
                )}
              </div>

              {/* Client-side actions (variants, quantity, cart) */}
              <ProductDetailActions product={product} variants={variants} />

              {/* Customizable CTA */}
              {product.is_customizable && (
                <div className="pt-2">
                  <Link
                    href={`/customize?product=${product.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 border-2 border-gold-500 text-choco-900 hover:bg-gold-50 rounded-full font-montserrat font-bold text-sm tracking-wide transition-colors"
                  >
                    ✨ Customize This Chocolate
                  </Link>
                </div>
              )}

              {/* Spec accordion */}
              <ProductSpecAccordion
                ingredients={product.ingredients}
                allergens={product.allergens}
                shelfLife={product.shelf_life}
                storageInstructions={product.storage_instructions}
              />
            </div>
          </div>

          {/* Customer Reviews Section */}
          <ProductReviews productId={product.id} productName={product.name} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-cream-200 pt-16">
              <div className="text-center mb-10">
                <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
                  From the Collection
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-choco-900 mt-1">
                  You May Also Like
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {allCategoryProducts.length > 5 && (
                <div className="text-center mt-10">
                  <Link
                    href={`/products?category=${categorySlug}`}
                    className="inline-flex items-center gap-2 px-8 py-3 border-2 border-choco-900 text-choco-900 rounded-full font-montserrat font-bold text-sm tracking-wide hover:bg-cream-100 transition-colors"
                  >
                    View All {categoryName}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
