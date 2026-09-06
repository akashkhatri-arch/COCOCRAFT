"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Clock, ChevronRight, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchMyOrdersAction } from "@/app/actions/orders";
import type { StoredOrder } from "@/lib/data/orders-store";

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchMyOrdersAction();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const getStatusBadge = (status: StoredOrder["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-gold-100 text-gold-900 border-gold-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-cream-200 text-choco-800 border-cream-300";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-choco-600 hover:text-choco-950 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Account</span>
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold text-choco-950">
              Your Order History
            </h1>
            <p className="text-xs sm:text-sm text-choco-500 font-sans">
              Track delivery progress and view itemized receipts for your COCOCRAFT chocolates.
            </p>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center text-xs font-montserrat text-choco-400">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center space-y-4">
              <Package className="h-12 w-12 text-choco-300 mx-auto" />
              <h2 className="font-serif text-xl font-bold text-choco-900">No Orders Found</h2>
              <p className="text-xs text-choco-500 max-w-sm mx-auto font-sans">
                You haven&rsquo;t placed any chocolate orders yet. Explore our bespoke chocolates or design your own bar.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-choco-900 text-cream-50 text-xs font-montserrat font-bold"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Explore Chocolates</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs hover:border-gold-300/80 transition-all p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-sm font-bold text-choco-950">
                        {ord.order_number}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-montserrat font-bold uppercase tracking-wider border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-choco-500 font-sans">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(ord.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span>·</span>
                      <span>
                        {ord.items.length} {ord.items.length === 1 ? "Item" : "Items"}
                      </span>
                      <span>·</span>
                      <span className="font-bold text-choco-900 font-montserrat">
                        {fmt(ord.total)}
                      </span>
                    </div>

                    <p className="text-xs text-choco-700 font-sans line-clamp-1">
                      {ord.items.map((i) => i.product_name).join(", ")}
                    </p>
                  </div>

                  <Link
                    href={`/account/orders/${ord.order_number}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-choco-900 text-choco-900 hover:bg-cream-100 text-xs font-montserrat font-bold transition-colors shrink-0"
                  >
                    <span>View & Track</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
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
