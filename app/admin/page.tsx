import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getOrders } from "@/lib/data/orders-store";
import { getProducts } from "@/lib/data/store";

export default async function AdminOverviewPage() {
  const orders = await getOrders();
  const products = await getProducts();

  const totalRevenue = orders.reduce((acc, o) => acc + (o.payment_status === "paid" ? o.total : 0), 0);
  const lowStockProducts = products.filter((p) => p.stock_quantity < 10);
  const recentOrders = orders.slice(0, 5);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-choco-950">
            Artisanal Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-choco-500 font-sans mt-0.5">
            Real-time catalog metrics, chocolate tempering queues, and order dispatches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 text-xs font-montserrat font-bold shadow-xs transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-full border border-choco-900 text-choco-900 hover:bg-cream-100 text-xs font-montserrat font-bold transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-choco-500 text-xs font-montserrat">
            <span>Total Revenue</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-choco-950 block">
            {fmt(totalRevenue)}
          </span>
          <span className="text-[11px] text-emerald-700 font-bold font-sans">
            From {orders.length} orders
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-choco-500 text-xs font-montserrat">
            <span>Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-gold-600" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-choco-950 block">
            {orders.length}
          </span>
          <span className="text-[11px] text-choco-500 font-sans">
            {orders.filter((o) => o.status === "confirmed" || o.status === "preparing").length} in active preparation
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-choco-500 text-xs font-montserrat">
            <span>Active Products</span>
            <Package className="h-4 w-4 text-choco-600" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-choco-950 block">
            {products.length}
          </span>
          <span className="text-[11px] text-choco-500 font-sans">
            Including Customizer bar
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-choco-500 text-xs font-montserrat">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-choco-950 block">
            {lowStockProducts.length}
          </span>
          <span className="text-[11px] text-amber-700 font-bold font-sans">
            {lowStockProducts.length === 0 ? "Inventory healthy" : "Requires restocking"}
          </span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-cream-100">
          <h2 className="font-serif text-xl font-bold text-choco-950">Recent Customer Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-montserrat font-bold text-gold-700 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-cream-200 text-choco-500 font-montserrat uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-bold">Order #</th>
                <th className="pb-3 font-bold">Customer</th>
                <th className="pb-3 font-bold">Items</th>
                <th className="pb-3 font-bold">Total</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 text-choco-800">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-choco-950">
                    {ord.order_number}
                  </td>
                  <td className="py-3.5">
                    <span className="font-medium text-choco-900 block">{ord.customer_name}</span>
                    <span className="text-[11px] text-choco-500">{ord.shipping_address.city}</span>
                  </td>
                  <td className="py-3.5">
                    {ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                  </td>
                  <td className="py-3.5 font-montserrat font-bold text-choco-950">
                    {fmt(ord.total)}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-montserrat font-bold uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-200">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/admin/orders`}
                      className="text-xs font-montserrat font-bold text-choco-900 hover:text-gold-600 underline"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
