"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Trash2, Sparkles, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, getCartCount } = useCartStore();

  useEffect(() => {
    // Avoid SSR hydration mismatch with Zustand persist
    queueMicrotask(() => setMounted(true));
  }, []);

  const totalCount = mounted ? getCartCount() : 0;
  const cartItems = mounted ? items : [];

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-montserrat text-choco-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-choco-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-choco-400" />
            <span className="text-choco-900 font-bold">Shopping Cart</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-cream-200">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-choco-950 tracking-tight">
                Your Selection
              </h1>
              <p className="font-montserrat text-xs sm:text-sm text-choco-600 mt-1">
                Handcrafted pure couverture chocolates, prepared fresh to order.
              </p>
            </div>
            {cartItems.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-gold-400/80 text-choco-950 font-montserrat font-bold text-xs">
                  {totalCount} {totalCount === 1 ? "Item" : "Items"}
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-1.5 text-xs font-montserrat text-choco-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>
            )}
          </div>

          {/* Cart Content */}
          {!mounted ? (
            // Skeleton while hydrating
            <div className="py-20 text-center text-choco-400">
              <div className="w-12 h-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto mb-4" />
              <p className="font-montserrat text-sm">Loading your artisanal selection...</p>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="py-16 sm:py-24 text-center max-w-lg mx-auto space-y-6">
              <div className="relative w-24 h-24 mx-auto rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center shadow-inner">
                <ShoppingBag className="h-10 w-10 text-choco-400" />
                <span className="absolute top-1 right-1 text-lg animate-bounce">✨</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-choco-950">
                  Your cart is empty
                </h2>
                <p className="text-sm text-choco-600 font-sans leading-relaxed">
                  Looks like you haven&rsquo;t chosen any delicious treats yet. Start crafting your personalized custom chocolate bar or explore our signature creations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link
                  href="/customize"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 font-montserrat font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
                >
                  <Sparkles className="h-4 w-4 text-gold-400" />
                  <span>Craft Custom Bar</span>
                </Link>
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-choco-900 text-choco-900 hover:bg-cream-100 font-montserrat font-bold text-sm tracking-wide transition-colors"
                >
                  <span>Explore Collection</span>
                </Link>
              </div>

              {/* Guarantees */}
              <div className="pt-10 border-t border-cream-200/80 grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-xl block mb-1">🍫</span>
                  <h4 className="font-montserrat font-bold text-xs text-choco-900">Pure Couverture</h4>
                  <p className="text-[11px] text-choco-500 font-sans">No vegetable fats</p>
                </div>
                <div>
                  <span className="text-xl block mb-1">❄️</span>
                  <h4 className="font-montserrat font-bold text-xs text-choco-900">Cold Chain</h4>
                  <p className="text-[11px] text-choco-500 font-sans">Melt-free guarantee</p>
                </div>
                <div>
                  <span className="text-xl block mb-1">🎁</span>
                  <h4 className="font-montserrat font-bold text-xs text-choco-900">Gifting Ready</h4>
                  <p className="text-[11px] text-choco-500 font-sans">Luxury packaging</p>
                </div>
              </div>
            </div>
          ) : (
            /* Filled Cart Grid */
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 items-start">
              {/* Left Column: Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}

                {/* Return to shop */}
                <div className="pt-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-xs font-montserrat font-bold text-choco-700 hover:text-choco-950 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Continue Shopping Chocolates</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary (Sticky) */}
              <div className="lg:sticky lg:top-28">
                <CartSummary />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
