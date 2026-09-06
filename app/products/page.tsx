import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { CatalogFilters } from "@/components/products/CatalogFilters";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { EmptyState } from "@/components/ui/ErrorStates";
import { getProducts, getCategories } from "@/lib/data/store";
import type { Metadata } from "next";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    featured?: string;
    inStock?: string;
    minPrice?: string;
    maxPrice?: string;
    priceRange?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const { category, q } = await searchParams;
  let title = "Shop Artisanal Chocolates | COCOCRAFT Collection";
  let description = "Browse our premium Belgian couverture chocolate bars, gift boxes, and bite collections. Handcrafted and shipped fresh across India.";

  if (q) {
    title = `Search results for "${q}" | COCOCRAFT`;
    description = `Explore chocolate creations matching "${q}" at COCOCRAFT.`;
  } else if (category) {
    const categories = await getCategories();
    const cat = categories.find((c) => c.slug === category);
    if (cat) {
      title = `${cat.name} | COCOCRAFT Artisanal Chocolates`;
      description = cat.description || description;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const {
    category = "",
    sort = "featured",
    q = "",
    featured,
    inStock,
    minPrice,
    maxPrice,
    priceRange = "all",
  } = await searchParams;

  const isFeaturedOnly = featured === "true";
  const isInStockOnly = inStock === "true";
  const parsedMinPrice = minPrice ? Number(minPrice) : undefined;
  const parsedMaxPrice = maxPrice ? Number(maxPrice) : undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: category || undefined,
      sort,
      searchQuery: q || undefined,
      featuredOnly: isFeaturedOnly || undefined,
      inStockOnly: isInStockOnly || undefined,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
    }),
  ]);

  const activeCategory = category ? categories.find((c) => c.slug === category) : null;
  const activeCategoryName = activeCategory ? activeCategory.name : q ? `Search: "${q}"` : "All Chocolates";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 text-choco-950 font-sans pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs & Title */}
          <div className="mb-8">
            <Breadcrumb
              items={
                category
                  ? [{ label: "Shop", href: "/products" }, { label: activeCategoryName }]
                  : [{ label: "Shop" }]
              }
              className="mb-3"
            />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl text-choco-900 font-normal">
                  {activeCategoryName}
                </h1>
                {activeCategory?.description && (
                  <p className="text-sm text-choco-600 font-sans mt-1 max-w-xl">
                    {activeCategory.description}
                  </p>
                )}
              </div>
              <p className="text-xs sm:text-sm text-choco-500 font-sans">
                Showing {products.length} {products.length === 1 ? "creation" : "creations"}
              </p>
            </div>
          </div>

          {/* Interactive filter controls */}
          <div className="mb-10">
            <CatalogFilters
              categories={categories}
              currentCategory={category}
              currentSort={sort}
              currentQuery={q}
              currentFeatured={isFeaturedOnly}
              currentInStock={isInStockOnly}
              currentPriceRange={priceRange}
            />
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm max-w-lg mx-auto mt-12">
              <EmptyState
                title="No chocolates found"
                message="We couldn't find any creations matching your selected filters. Try broadening your criteria or reset filters."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
