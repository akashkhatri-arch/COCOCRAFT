"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
} from "lucide-react";
import type { StoredOrder } from "@/lib/data/orders-store";
import { changeOrderStatusAction, fetchAllOrdersAction } from "@/app/actions/admin";
import { CustomizationDetails } from "@/components/cart/CustomizationDetails";

const STATUS_OPTIONS: StoredOrder["status"][] = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    let active = true;
    fetchAllOrdersAction().then((data) => {
      if (active) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: StoredOrder["status"]) => {
    await changeOrderStatusAction(orderId, newStatus);
    const data = await fetchAllOrdersAction();
    setOrders(data);
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.order_number === orderId)) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-choco-950">
          Order Fulfillment Management
        </h1>
        <p className="text-xs sm:text-sm text-choco-500 font-sans mt-0.5">
          Inspect custom chocolate recipes, update fulfillment stages, and verify courier dispatches.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-choco-900 text-cream-50"
              : "bg-white border border-cream-200 text-choco-700 hover:bg-cream-100"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((st) => {
          const count = orders.filter((o) => o.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-montserrat font-bold capitalize transition-all cursor-pointer ${
                filter === st
                  ? "bg-choco-900 text-cream-50"
                  : "bg-white border border-cream-200 text-choco-700 hover:bg-cream-100"
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
        {/* Left: Orders List */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 space-y-3 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-choco-950 pb-2 border-b border-cream-100">
            Orders ({filteredOrders.length})
          </h2>

          {loading ? (
            <div className="py-12 text-center text-xs text-choco-400 font-montserrat">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-choco-500 font-sans">
              No orders found matching filter &ldquo;{filter}&rdquo;.
            </div>
          ) : (
            <div className="divide-y divide-cream-100">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`py-4 px-3 rounded-2xl cursor-pointer transition-colors ${
                    selectedOrder?.id === ord.id ? "bg-cream-100/70" : "hover:bg-cream-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-choco-950 text-sm">
                      {ord.order_number}
                    </span>
                    <span className="font-montserrat font-bold text-choco-950 text-xs">
                      {fmt(ord.total)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-choco-500 font-sans mt-1">
                    <span>
                      {ord.customer_name} ({ord.shipping_address.city})
                    </span>
                    <span className="capitalize font-montserrat font-semibold text-choco-800">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Selected Order Detail Inspector */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 space-y-6 shadow-sm sticky top-6">
          {!selectedOrder ? (
            <div className="py-16 text-center text-xs text-choco-400 font-sans space-y-2">
              <ShoppingBag className="h-8 w-8 text-choco-300 mx-auto" />
              <p>Select an order on the left to inspect recipes and update fulfillment status.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-cream-100">
                <div>
                  <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-choco-400">
                    Active Inspection
                  </span>
                  <h3 className="font-mono font-bold text-lg text-choco-950">
                    {selectedOrder.order_number}
                  </h3>
                </div>

                {/* Status Dropdown */}
                <div className="space-y-1 text-right">
                  <label className="text-[10px] font-montserrat font-bold text-choco-500 uppercase">
                    Update Status:
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.id, e.target.value as StoredOrder["status"])
                    }
                    className="block px-3 py-1.5 rounded-xl border border-cream-300 bg-cream-50 text-xs font-montserrat font-bold text-choco-950 focus:outline-none focus:border-gold-500 capitalize"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="text-xs font-sans space-y-1 bg-cream-50/70 p-4 rounded-2xl border border-cream-200">
                <span className="font-montserrat font-bold text-choco-900 block text-xs">
                  Customer & Shipping
                </span>
                <p className="font-bold text-choco-950">{selectedOrder.customer_name}</p>
                <p>{selectedOrder.shipping_address.line1}</p>
                {selectedOrder.shipping_address.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
                <p>
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} -{" "}
                  {selectedOrder.shipping_address.pincode}
                </p>
                <p className="text-choco-500 pt-1">
                  📞 {selectedOrder.customer_phone} · ✉️ {selectedOrder.customer_email}
                </p>
                {selectedOrder.notes && (
                  <p className="pt-2 text-amber-900 italic">
                    Note: &ldquo;{selectedOrder.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Items & Customizer Breakdown */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-choco-950 text-sm">
                  Chocolates Ordered ({selectedOrder.items.length})
                </h4>

                <div className="divide-y divide-cream-100 max-h-72 overflow-y-auto pr-1">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="py-3 text-xs font-sans space-y-1.5">
                      <div className="flex justify-between font-montserrat font-bold text-choco-900">
                        <span>{it.product_name}</span>
                        <span>{fmt(it.total_price)}</span>
                      </div>
                      <span className="text-choco-500 text-[11px] block">
                        Quantity: {it.quantity} × {fmt(it.unit_price)}
                      </span>
                      {it.customization && (
                        <CustomizationDetails customization={it.customization} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial summary */}
              <div className="pt-3 border-t border-cream-200 text-xs font-sans space-y-1">
                <div className="flex justify-between text-choco-600">
                  <span>Subtotal</span>
                  <span>{fmt(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span>-{fmt(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-choco-600">
                  <span>Shipping</span>
                  <span>{selectedOrder.shipping_fee === 0 ? "FREE" : fmt(selectedOrder.shipping_fee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-choco-950 pt-2 border-t border-cream-100">
                  <span className="font-serif">Grand Total</span>
                  <span className="font-serif text-lg">{fmt(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
