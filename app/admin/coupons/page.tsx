"use client";

import React, { useState } from "react";
import { Tag, Plus, Check, X, Edit2 } from "lucide-react";

interface PromoCoupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
  active: boolean;
  label: string;
}

const INITIAL_COUPONS: PromoCoupon[] = [
  {
    id: "cpn-1",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minSubtotal: 499,
    active: true,
    label: "10% off for new connoisseurs",
  },
  {
    id: "cpn-2",
    code: "SWEET50",
    type: "fixed",
    value: 50,
    minSubtotal: 299,
    active: true,
    label: "Flat ₹50 savings on any bar",
  },
  {
    id: "cpn-3",
    code: "COCO15",
    type: "percentage",
    value: 15,
    minSubtotal: 799,
    maxDiscount: 300,
    active: true,
    label: "15% off gourmet boxes over ₹799",
  },
  {
    id: "cpn-4",
    code: "FREESHIP",
    type: "fixed",
    value: 99,
    minSubtotal: 0,
    active: true,
    label: "Free express cold-chain shipping",
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<PromoCoupon[]>(INITIAL_COUPONS);

  const handleToggle = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-choco-950">
            Promo Codes & Discounts
          </h1>
          <p className="text-xs sm:text-sm text-choco-500 font-sans mt-0.5">
            Configure cart discounts, festive sales campaigns, and minimum order requirements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Coupon builder scaffolded.")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 text-xs font-montserrat font-bold transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-cream-200 text-choco-500 font-montserrat uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-bold">Code</th>
                <th className="pb-3 font-bold">Type</th>
                <th className="pb-3 font-bold">Discount Value</th>
                <th className="pb-3 font-bold">Min Subtotal</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 text-choco-800">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-choco-950 text-sm">
                    <span className="px-2.5 py-1 rounded-md bg-cream-100 border border-cream-200">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3.5 capitalize text-choco-600">
                    {c.type}
                  </td>
                  <td className="py-3.5 font-montserrat font-bold text-choco-950">
                    {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}
                    {c.maxDiscount ? ` (cap ₹${c.maxDiscount})` : ""}
                  </td>
                  <td className="py-3.5 text-choco-800 font-medium">
                    ₹{c.minSubtotal}
                  </td>
                  <td className="py-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggle(c.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-montserrat font-bold transition-colors cursor-pointer ${
                        c.active
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {c.active ? "Active" : "Paused"}
                    </button>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Edit coupon: ${c.code}`)}
                      className="p-1 text-choco-500 hover:text-choco-950 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
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
