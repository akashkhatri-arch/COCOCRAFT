"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomizationDetails } from "@/components/cart/CustomizationDetails";
import { fetchOrderByIdOrNumberAction } from "@/app/actions/orders";
import type { StoredOrder } from "@/lib/data/orders-store";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

const TIMELINE_STEPS = [
  { key: "confirmed", label: "Order Confirmed", desc: "Recipe validated & queued" },
  { key: "preparing", label: "Handcrafting & Tempering", desc: "Pure couverture tempered & molded" },
  { key: "shipped", label: "Insulated Express Transit", desc: "Packed with dry ice & shipped" },
  { key: "delivered", label: "Delivered Melt-Free", desc: "Safely arrived at destination" },
];

export default function OrderTrackingDetailPage({ params }: OrderTrackingPageProps) {
  const resolvedParams = use(params);
  const identifier = resolvedParams.id;

  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchOrderByIdOrNumberAction(identifier);
      setOrder(data);
      setLoading(false);
    }
    load();
  }, [identifier]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const getStepStatus = (stepKey: string, currentStatus: StoredOrder["status"]) => {
    const orderIndex: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      preparing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: -1,
    };

    const currentIdx = orderIndex[currentStatus] ?? 1;
    const stepIdx = orderIndex[stepKey] ?? 1;

    if (currentStatus === "cancelled") return "cancelled";
    if (stepIdx <= currentIdx) return "completed";
    return "upcoming";
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-choco-600 hover:text-choco-950 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Orders</span>
          </Link>

          {loading ? (
            <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center text-xs font-montserrat text-choco-400">
              Retrieving order and tracking status...
            </div>
          ) : !order ? (
            <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center space-y-3">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
              <h2 className="font-serif text-xl font-bold text-choco-950">Order Not Found</h2>
              <p className="text-xs text-choco-500 font-sans">
                We could not locate an order matching reference &ldquo;{identifier}&rdquo;.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Header Card */}
              <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-100">
                  <div>
                    <span className="text-[11px] font-montserrat uppercase tracking-wider text-choco-500 font-bold block">
                      Order Reference
                    </span>
                    <h1 className="font-mono text-xl sm:text-2xl font-bold text-choco-950">
                      {order.order_number}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-300">
                      Status: {order.status}
                    </span>
                  </div>
                </div>

                {/* Timeline Component */}
                <div className="pt-2">
                  <h3 className="font-montserrat font-bold text-xs uppercase tracking-wider text-choco-700 mb-6 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold-600" />
                    <span>Fulfillment Progress</span>
                  </h3>

                  {order.status === "cancelled" ? (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
                      This order has been cancelled. If any payment was captured, refund is initiated.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                      {TIMELINE_STEPS.map((st, idx) => {
                        const state = getStepStatus(st.key, order.status);
                        return (
                          <div key={st.key} className="flex sm:flex-col items-start gap-3 sm:gap-2">
                            <div className="relative">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                  state === "completed"
                                    ? "bg-choco-900 text-gold-400 ring-4 ring-gold-100"
                                    : "bg-cream-200 text-choco-400"
                                }`}
                              >
                                {state === "completed" ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  idx + 1
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`font-montserrat font-bold text-xs ${
                                  state === "completed" ? "text-choco-950" : "text-choco-400"
                                }`}
                              >
                                {st.label}
                              </h4>
                              <p className="text-[11px] text-choco-500 font-sans mt-0.5">
                                {st.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-8 space-y-4">
                <h3 className="font-serif text-lg font-bold text-choco-950 flex items-center gap-2 pb-2 border-b border-cream-100">
                  <Package className="h-4 w-4 text-gold-600" />
                  <span>Items in This Delivery ({order.items.length})</span>
                </h3>

                <div className="divide-y divide-cream-100">
                  {order.items.map((it) => (
                    <div key={it.id} className="py-4 space-y-2">
                      <div className="flex justify-between items-baseline gap-2">
                        <div>
                          <h4 className="font-montserrat font-bold text-sm text-choco-950">
                            {it.product_name}
                          </h4>
                          <span className="text-xs text-choco-500 font-sans">
                            Qty: {it.quantity} × {fmt(it.unit_price)}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-base text-choco-950">
                          {fmt(it.total_price)}
                        </span>
                      </div>

                      {it.customization && (
                        <CustomizationDetails customization={it.customization} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Financial Totals */}
                <div className="pt-4 border-t border-cream-200 space-y-2 text-xs font-sans max-w-xs ml-auto">
                  <div className="flex justify-between text-choco-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">{fmt(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span className="font-bold">-{fmt(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-choco-700">
                    <span>Shipping</span>
                    <span className="font-semibold">{order.shipping_fee === 0 ? "FREE" : fmt(order.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-choco-950 pt-2 border-t border-cream-200">
                    <span className="font-serif">Grand Total</span>
                    <span className="font-serif text-xl">{fmt(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-8 space-y-3">
                <h3 className="font-serif text-lg font-bold text-choco-950 flex items-center gap-2 pb-2 border-b border-cream-100">
                  <MapPin className="h-4 w-4 text-gold-600" />
                  <span>Destination & Recipient</span>
                </h3>

                <div className="text-xs font-sans text-choco-800 space-y-1">
                  <p className="font-montserrat font-bold text-choco-950 text-sm">{order.customer_name}</p>
                  <p>{order.shipping_address.line1}</p>
                  {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                  </p>
                  <p className="text-choco-500 pt-1">
                    Phone: +91 {order.customer_phone} · Email: {order.customer_email}
                  </p>
                  {order.notes && (
                    <p className="mt-2 p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-choco-700 italic">
                      Note: &ldquo;{order.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
