"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Select } from "@/components/ui/Select";
import type { Category } from "@/types/database";

interface CatalogFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
  currentQuery?: string;
  currentFeatured?: boolean;
  currentInStock?: boolean;
  currentPriceRange?: string; // e.g. 'all' | 'under-400' | '400-800' | 'above-800'
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  categories,
  currentCategory = "",
  currentSort = "featured",
  currentQuery = "",
  currentFeatured = false,
  currentInStock = false,
  currentPriceRange = "all",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(currentQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Update URL params
  const updateParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (debouncedSearch !== currentQuery) {
      updateParams({ q: debouncedSearch || null });
    }
  }, [debouncedSearch, currentQuery, updateParams]);

  const handleCategoryClick = (slug: string) => {
    updateParams({
      category: currentCategory === slug ? null : slug,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({
      sort: e.target.value,
    });
  };

  const handlePriceRangeChange = (range: string) => {
    if (range === "all") {
      updateParams({ minPrice: null, maxPrice: null, priceRange: null });
    } else if (range === "under-400") {
      updateParams({ minPrice: null, maxPrice: "400", priceRange: "under-400" });
    } else if (range === "400-800") {
      updateParams({ minPrice: "400", maxPrice: "800", priceRange: "400-800" });
    } else if (range === "above-800") {
      updateParams({ minPrice: "800", maxPrice: null, priceRange: "above-800" });
    }
  };

  const handleFeaturedToggle = () => {
    updateParams({
      featured: currentFeatured ? null : "true",
    });
  };

  const handleInStockToggle = () => {
    updateParams({
      inStock: currentInStock ? null : "true",
    });
  };

  const hasActiveFilters = Boolean(
    currentCategory ||
      currentQuery ||
      currentFeatured ||
      currentInStock ||
      (currentPriceRange && currentPriceRange !== "all") ||
      (currentSort && currentSort !== "featured")
  );

  const handleResetFilters = () => {
    router.push("/products");
    setSearch("");
  };

  return (
    <div className="space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-cream-200 shadow-sm">
      {/* Search & Sort Panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-choco-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search our chocolate collection..."
            className="flex w-full h-11 pl-10 pr-4 rounded-xl border border-cream-200 bg-cream-50/50 font-sans text-sm text-choco-950 transition-colors placeholder:text-choco-400 focus:outline-none focus:border-gold-500 focus:bg-white"
            aria-label="Search products"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0 justify-between sm:justify-end">
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-choco-600">
            Sort By
          </span>
          <div className="w-48">
            <Select
              value={currentSort}
              onChange={handleSortChange}
              options={[
                { value: "featured", label: "Featured" },
                { value: "price_asc", label: "Price: Low to High" },
                { value: "price_desc", label: "Price: High to Low" },
                { value: "newest", label: "Newest Arrivals" },
              ]}
              aria-label="Sort products"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex flex-col gap-2 pt-2 border-t border-cream-100">
        <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-choco-500 flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-choco-400" />
          Categories
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams({ category: null })}
            className={cn(
              "px-3.5 py-1.5 rounded-full font-montserrat font-semibold text-xs tracking-wide border transition-all cursor-pointer",
              currentCategory === ""
                ? "bg-choco-900 text-cream-50 border-choco-900 shadow-xs"
                : "bg-white text-choco-800 border-cream-200 hover:bg-cream-50 hover:border-choco-300"
            )}
          >
            All Products
          </button>
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full font-montserrat font-semibold text-xs tracking-wide border transition-all cursor-pointer",
                  isSelected
                    ? "bg-choco-900 text-cream-50 border-choco-900 shadow-xs"
                    : "bg-white text-choco-800 border-cream-200 hover:bg-cream-50 hover:border-choco-300"
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Filter Row: Price, Availability, Featured, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-cream-100">
        <div className="flex flex-wrap items-center gap-3">
          {/* Price Range Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-sans">
            <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-choco-500 mr-1">
              Price:
            </span>
            {[
              { id: "all", label: "All" },
              { id: "under-400", label: "< ₹400" },
              { id: "400-800", label: "₹400-₹800" },
              { id: "above-800", label: "> ₹800" },
            ].map((p) => {
              const isActive = currentPriceRange === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePriceRangeChange(p.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border",
                    isActive
                      ? "bg-gold-500/15 border-gold-500 text-choco-950 font-bold"
                      : "border-cream-200 bg-white text-choco-700 hover:bg-cream-50"
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Quick Filter Toggles: Featured and In Stock */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFeaturedToggle}
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer",
                currentFeatured
                  ? "bg-gold-500/15 border-gold-500 text-choco-950 font-bold"
                  : "border-cream-200 bg-white text-choco-700 hover:bg-cream-50"
              )}
            >
              {currentFeatured && <Check className="h-3 w-3 text-gold-600" />}
              Featured
            </button>

            <button
              onClick={handleInStockToggle}
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer",
                currentInStock
                  ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                  : "border-cream-200 bg-white text-choco-700 hover:bg-cream-50"
              )}
            >
              {currentInStock && <Check className="h-3 w-3 text-emerald-600" />}
              In Stock
            </button>
          </div>
        </div>

        {/* Clear/Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-montserrat font-bold cursor-pointer transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
