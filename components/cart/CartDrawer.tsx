"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { CartItemRow } from "./CartItemRow";
import { siteConfig } from "@/config/site";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getCartSubtotal,
    getCartCount,
  } = useCartStore();

  const subtotal = getCartSubtotal();
  const count = getCartCount();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const amountToFreeShipping = Math.max(0, siteConfig.shippingThreshold - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / siteConfig.shippingThreshold) * 100)
  );

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-choco-950/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart Drawer"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 bg-cream-50/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-choco-900" />
                <h2 className="font-serif text-lg font-bold text-choco-950">
                  Your Cart
                </h2>
                {count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-400 text-choco-950 text-xs font-montserrat font-bold">
                    {count}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart drawer"
                className="w-8 h-8 flex items-center justify-center rounded-full text-choco-500 hover:text-choco-950 hover:bg-cream-200/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress in Drawer */}
            {count > 0 && (
              <div className="px-6 py-2.5 bg-cream-100/60 border-b border-cream-200/70 text-xs font-montserrat">
                <div className="flex items-center justify-between mb-1.5">
                  {amountToFreeShipping > 0 ? (
                    <span className="text-choco-700">
                      Add <strong>{fmt(amountToFreeShipping)}</strong> for free shipping
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-gold-500" />
                      Free Delivery Unlocked!
                    </span>
                  )}
                  <span className="text-choco-500">{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-cream-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gold-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Drawer Body / Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-cream-100">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center text-3xl">
                    🍫
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-choco-950">
                      Your cart is empty
                    </h3>
                    <p className="text-xs text-choco-500 max-w-xs font-sans">
                      Start by building your own custom chocolate bar or explore our curated artisanal collection.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full pt-2">
                    <Link
                      href="/customize"
                      onClick={closeDrawer}
                      className="w-full py-2.5 px-4 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 text-xs font-montserrat font-bold transition-colors text-center"
                    >
                      Craft Custom Bar
                    </Link>
                    <Link
                      href="/products"
                      onClick={closeDrawer}
                      className="w-full py-2.5 px-4 rounded-full border border-cream-300 hover:bg-cream-100 text-choco-800 text-xs font-montserrat font-bold transition-colors text-center"
                    >
                      Browse All Chocolates
                    </Link>
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    compact
                  />
                ))
              )}
            </div>

            {/* Drawer Footer / Subtotal & Actions */}
            {items.length > 0 && (
              <div className="p-6 border-t border-cream-200 bg-cream-50/70 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-base font-bold text-choco-950">
                    Subtotal
                  </span>
                  <span className="font-serif text-xl font-bold text-choco-950">
                    {fmt(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-choco-500 font-sans -mt-2">
                  Shipping and promo discounts calculated at next step.
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="flex items-center justify-center py-3 px-4 rounded-full border border-choco-900 text-choco-900 hover:bg-cream-100 font-montserrat font-bold text-xs tracking-wide transition-colors"
                  >
                    View Full Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 font-montserrat font-bold text-xs tracking-wide transition-colors shadow-sm"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
