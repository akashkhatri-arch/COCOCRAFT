"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Truck, Sparkles, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/store/cart";
import { fetchOrderByIdOrNumberAction } from "@/app/actions/orders";
import type { StoredOrder } from "@/lib/data/orders-store";

interface PageProps {
  searchParams: Promise<{ orderNumber?: string; orderId?: string }>;
}

export default function OrderSuccessPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const orderNumber = resolvedParams.orderNumber || "CC-CONFIRMED";
  const { clearCart } = useCartStore();

  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    // Clear cart upon successful order creation
    clearCart();

    if (orderNumber) {
      fetchOrderByIdOrNumberAction(orderNumber).then((o) => {
        if (o) setOrder(o);
      });
    }
  }, [orderNumber, clearCart]);

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-10 text-center space-y-8">
            {/* Success Icon */}
            <div className="relative w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
              <span className="absolute -top-1 -right-1 text-xl animate-bounce">✨</span>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-montserrat font-bold uppercase tracking-wider">
                Order Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-choco-950">
                Your Chocolate Masterpiece is Reserved!
              </h1>
              <p className="text-sm font-sans text-choco-600 max-w-md mx-auto">
                Thank you for your order. Our master chocolatiers have received your recipe and are preparing your pure couverture bars.
              </p>
            </div>

            {/* Order Reference Badge */}
            <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200 inline-flex flex-col items-center gap-1 text-choco-900">
              <span className="text-[11px] font-montserrat uppercase tracking-wider text-choco-500 font-bold">
                Order Reference Number
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-choco-950 tracking-wider">
                {orderNumber}
              </span>
            </div>

            {/* Delivery Timeline Card */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-left space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-montserrat font-bold text-xs sm:text-sm">
                <Truck className="h-4 w-4 text-gold-600 shrink-0" />
                <span>Cold-Chain Express Delivery: Estimated 3–5 Business Days</span>
              </div>
              <p className="text-xs text-amber-800 font-sans leading-relaxed">
                Your order is packed in custom insulated silver packaging with food-grade gel ice packs to ensure 100% melt-free arrival at 18°C. A confirmation tracking link will be sent to your email.
              </p>
            </div>

            {/* Order Items Summary (if retrieved) */}
            {order && order.items && (
              <div className="text-left space-y-3 pt-4 border-t border-cream-100">
                <h3 className="font-serif text-lg font-bold text-choco-950 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gold-600" />
                  <span>Order Receipt Details</span>
                </h3>

                <div className="divide-y divide-cream-100 rounded-2xl bg-cream-50/50 border border-cream-200 p-4 text-xs font-sans">
                  {order.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-choco-900 block font-montserrat">
                          {it.product_name}
                        </span>
                        <span className="text-choco-500 text-[11px]">
                          Qty: {it.quantity} × {fmt(it.unit_price)}
                        </span>
                      </div>
                      <span className="font-montserrat font-bold text-choco-950">
                        {fmt(it.total_price)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 mt-2 space-y-1.5 font-sans">
                    <div className="flex justify-between text-choco-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">{fmt(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount</span>
                        <span className="font-bold">-{fmt(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-choco-600">
                      <span>Shipping</span>
                      <span className="font-semibold">{order.shipping_fee === 0 ? "FREE" : fmt(order.shipping_fee)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-choco-950 pt-2 border-t border-cream-200">
                      <span className="font-serif">Total Paid</span>
                      <span className="font-serif text-xl">{fmt(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-cream-100">
              <Link
                href="/account/orders"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 font-montserrat font-bold text-xs tracking-wide shadow-md transition-all"
              >
                <span>Track & View Orders</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-choco-900 text-choco-900 hover:bg-cream-100 font-montserrat font-bold text-xs tracking-wide transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
