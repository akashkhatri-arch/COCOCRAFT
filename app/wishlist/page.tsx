"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { toast } from "@/components/ui/Toast";
import { devProducts } from "@/lib/data/dev-data";
import type { Product } from "@/types/database";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { itemIds, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const savedProducts = mounted
    ? devProducts.filter((p) => itemIds.includes(p.id))
    : [];

  const handleMoveToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.base_price,
      image: product.main_image,
      quantity: 1,
    });
    removeFromWishlist(product.id);
    toast.success(`${product.name} moved to cart!`);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-choco-600 hover:text-choco-950 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Continue Shopping</span>
            </Link>

            {savedProducts.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-montserrat text-choco-500 hover:text-red-600 transition-colors"
              >
                Clear Wishlist
              </button>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold text-choco-950 flex items-center gap-2.5">
              <Heart className="h-6 w-6 text-gold-600 fill-gold-600" />
              <span>Your Curated Wishlist</span>
            </h1>
            <p className="text-xs sm:text-sm text-choco-500 font-sans">
              Saved creations ready for your next moment of indulgence or gourmet gifting.
            </p>
          </div>

          {!mounted ? (
            <div className="py-16 text-center text-xs text-choco-400 font-montserrat">
              Loading wishlist...
            </div>
          ) : savedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-choco-300 mx-auto">
                <Heart className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-xl font-bold text-choco-900">Your wishlist is empty</h2>
              <p className="text-xs text-choco-500 font-sans leading-relaxed">
                Save your dream custom chocolate recipes and signature collections by clicking the heart icon on any product.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-choco-900 text-cream-50 text-xs font-montserrat font-bold shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                  <span>Explore Collection</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-4/3 bg-cream-100">
                      {p.main_image ? (
                        <Image
                          src={p.main_image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 300px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🍫
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(p.id)}
                        aria-label="Remove from wishlist"
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-choco-600 hover:text-red-600 hover:bg-white flex items-center justify-center shadow-xs transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="font-serif text-base font-bold text-choco-950 line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-choco-500 font-sans line-clamp-2">
                        {p.short_description || p.description}
                      </p>
                      <span className="font-montserrat font-bold text-sm text-choco-950 block pt-1">
                        {fmt(p.base_price)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(p)}
                      className="w-full py-2.5 px-4 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 text-xs font-montserrat font-bold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
