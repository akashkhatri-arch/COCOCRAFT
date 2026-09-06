"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser, logoutAction, type AuthUser } from "@/app/actions/auth";
import { fetchMyOrdersAction } from "@/app/actions/orders";
import type { StoredOrder } from "@/lib/data/orders-store";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [recentOrders, setRecentOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      if (!u) {
        // Fallback default customer persona if unauthenticated
        setUser({
          id: "demo-user-123",
          name: "Elena Sharma",
          email: "elena@example.com",
          role: "customer",
        });
      } else {
        setUser(u);
      }

      const orders = await fetchMyOrdersAction();
      setRecentOrders(orders.slice(0, 3));
      setLoading(false);
    }
    load();
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Hero Profile Bar */}
          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-choco-900 text-cream-50 flex items-center justify-center font-serif text-2xl font-bold shadow-inner">
                {user?.name?.charAt(0) || "C"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-choco-950">
                    Hello, {user?.name || "Connoisseur"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-400 text-choco-950 text-[10px] font-montserrat font-bold uppercase tracking-wider">
                    {user?.role === "admin" ? "Artisan Admin" : "Club Member"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-choco-500 font-sans mt-0.5">
                  {user?.email} · Member since 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-gold-500 text-choco-950 hover:bg-gold-400 text-xs font-montserrat font-bold transition-all shadow-xs"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Console</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-cream-300 hover:border-red-300 hover:bg-red-50 text-choco-700 hover:text-red-700 text-xs font-montserrat font-bold transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Access Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Link
              href="/account/orders"
              className="p-6 bg-white rounded-2xl border border-cream-200 hover:border-gold-400 shadow-2xs hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-choco-900 group-hover:bg-gold-100 transition-colors">
                  <Package className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-choco-400 group-hover:text-choco-950 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-serif text-lg font-bold text-choco-950">Your Orders</h3>
              <p className="text-xs text-choco-500 font-sans mt-1">
                Track active chocolate shipments and re-order previous recipes.
              </p>
            </Link>

            <Link
              href="/wishlist"
              className="p-6 bg-white rounded-2xl border border-cream-200 hover:border-gold-400 shadow-2xs hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-choco-900 group-hover:bg-gold-100 transition-colors">
                  <Heart className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-choco-400 group-hover:text-choco-950 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-serif text-lg font-bold text-choco-950">Wishlist</h3>
              <p className="text-xs text-choco-500 font-sans mt-1">
                View your favorite artisanal bars and planned flavor combinations.
              </p>
            </Link>

            <Link
              href="/customize"
              className="p-6 bg-white rounded-2xl border border-cream-200 hover:border-gold-400 shadow-2xs hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-choco-900 group-hover:bg-gold-100 transition-colors">
                  <Sparkles className="h-5 w-5 text-gold-600" />
                </div>
                <ArrowRight className="h-4 w-4 text-choco-400 group-hover:text-choco-950 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-serif text-lg font-bold text-choco-950">Craft a Bar</h3>
              <p className="text-xs text-choco-500 font-sans mt-1">
                Launch the 6-step interactive chocolate customizer.
              </p>
            </Link>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-cream-100">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-choco-950">
                  Recent Orders
                </h2>
                <p className="text-xs text-choco-500 font-sans">
                  Real-time status of your artisanal chocolate deliveries.
                </p>
              </div>
              <Link
                href="/account/orders"
                className="text-xs font-montserrat font-bold text-gold-700 hover:text-gold-900 hover:underline"
              >
                View All Orders
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-choco-400 font-montserrat">
                Loading order history...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm text-choco-500 font-sans">You have not placed any orders yet.</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-choco-900 text-cream-50 text-xs font-montserrat font-bold"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                {recentOrders.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-choco-950 text-sm">
                          {ord.order_number}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-montserrat font-bold uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-200">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-choco-500 font-sans">
                        Ordered on {new Date(ord.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {ord.items.length} {ord.items.length === 1 ? "Item" : "Items"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-serif text-lg font-bold text-choco-950">
                        {fmt(ord.total)}
                      </span>
                      <Link
                        href={`/account/orders/${ord.order_number}`}
                        className="px-4 py-2 rounded-full border border-choco-900 text-choco-900 hover:bg-cream-100 text-xs font-montserrat font-bold transition-colors"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
