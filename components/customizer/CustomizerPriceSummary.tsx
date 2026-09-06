"use client";

import { siteConfig } from "@/config/site";
import type { CustomizerPriceBreakdown } from "@/types/customizer";

interface CustomizerPriceSummaryProps {
  breakdown: CustomizerPriceBreakdown;
  chocolateTypeName?: string;
  variantName?: string;
  toppingCount: number;
  addonCount: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

interface RowProps { label: string; amount: number; isBold?: boolean; isTotal?: boolean }
function Row({ label, amount, isBold, isTotal }: RowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-2 ${
        isTotal ? "border-t border-cream-200 pt-3 mt-1" : ""
      }`}
    >
      <span
        className={`text-xs font-sans ${
          isTotal ? "font-bold text-choco-900" : isBold ? "font-semibold text-choco-700" : "text-choco-500"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-xs font-montserrat ${
          isTotal ? "font-black text-choco-900 text-sm" : "font-bold text-choco-700"
        }`}
      >
        {amount === 0 ? (
          <span className="text-emerald-600">Free</span>
        ) : (
          fmt(amount)
        )}
      </span>
    </div>
  );
}

export function CustomizerPriceSummary({
  breakdown,
  chocolateTypeName,
  variantName,
  toppingCount,
  addonCount,
}: CustomizerPriceSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-5 space-y-2.5">
      <p className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600 mb-3">
        Price Summary
      </p>

      <Row label={`Base Chocolate${variantName ? ` · ${variantName}` : ""}`} amount={breakdown.basePrice} />

      {breakdown.variantMod > 0 && (
        <Row label="Size Upgrade" amount={breakdown.variantMod} />
      )}

      {breakdown.chocolateMod > 0 && (
        <Row label={chocolateTypeName ?? "Chocolate Type"} amount={breakdown.chocolateMod} />
      )}

      {breakdown.toppingsTotal > 0 && (
        <Row label={`Toppings (${toppingCount})`} amount={breakdown.toppingsTotal} />
      )}

      {breakdown.addonsTotal > 0 && (
        <Row label={`Add-ons (${addonCount})`} amount={breakdown.addonsTotal} />
      )}

      <Row label={`Unit Price`} amount={breakdown.itemSubtotal} isBold />

      {breakdown.quantity > 1 && (
        <Row label={`× ${breakdown.quantity} bars`} amount={breakdown.subtotal} isBold />
      )}

      <Row
        label={`Total${breakdown.quantity > 1 ? ` (${breakdown.quantity} bars)` : ""}`}
        amount={breakdown.subtotal}
        isTotal
      />

      {/* Shipping hint */}
      <p className="text-[10px] text-choco-400 font-sans pt-1">
        {breakdown.subtotal >= siteConfig.shippingThreshold
          ? "✓ Free shipping included"
          : `Add ${fmt(siteConfig.shippingThreshold - breakdown.subtotal)} more for free shipping`}
      </p>
    </div>
  );
}
