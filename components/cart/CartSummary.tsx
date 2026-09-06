"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, ArrowRight, ShieldCheck, Truck, Sparkles, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/store/cart";

// Available promo coupons configuration
const VALID_COUPONS: Record<
  string,
  {
    type: "percentage" | "fixed";
    value: number;
    minSubtotal: number;
    maxDiscount?: number;
    label: string;
  }
> = {
  WELCOME10: {
    type: "percentage",
    value: 10,
    minSubtotal: 499,
    label: "10% off on your order",
  },
  SWEET50: {
    type: "fixed",
    value: 50,
    minSubtotal: 299,
    label: "Flat ₹50 off",
  },
  COCO15: {
    type: "percentage",
    value: 15,
    minSubtotal: 799,
    maxDiscount: 300,
    label: "15% off up to ₹300",
  },
  FREESHIP: {
    type: "fixed",
    value: siteConfig.defaultShippingFee,
    minSubtotal: 0,
    label: "Free Standard Shipping",
  },
};

interface CartSummaryProps {
  compact?: boolean;
  onCheckoutClick?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  compact = false,
  onCheckoutClick,
}) => {
  const { getCartSubtotal, appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
  const subtotal = getCartSubtotal();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Free shipping threshold calculation
  const amountToFreeShipping = Math.max(0, siteConfig.shippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / siteConfig.shippingThreshold) * 100));

  // Calculate discount based on subtotal and active coupon
  let discount = 0;
  let isFreeShippingCoupon = false;

  if (appliedCoupon) {
    if (appliedCoupon.code === "FREESHIP") {
      isFreeShippingCoupon = true;
    } else if (appliedCoupon.type === "percentage") {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
      const couponMeta = VALID_COUPONS[appliedCoupon.code];
      if (couponMeta?.maxDiscount) {
        discount = Math.min(discount, couponMeta.maxDiscount);
      }
    } else {
      discount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  // Shipping fee
  const standardShipping =
    subtotal >= siteConfig.shippingThreshold || subtotal === 0 || isFreeShippingCoupon
      ? 0
      : siteConfig.defaultShippingFee;

  // Taxes
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(((taxableAmount * siteConfig.taxRate) / 100) * 100) / 100;

  // Grand Total
  const grandTotal = Math.max(0, taxableAmount + standardShipping + tax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    const coupon = VALID_COUPONS[cleanCode];
    if (!coupon) {
      setCouponError("Invalid promo code. Try WELCOME10 or SWEET50");
      return;
    }

    if (subtotal < coupon.minSubtotal) {
      setCouponError(
        `Minimum order of ₹${coupon.minSubtotal} required for coupon ${cleanCode}`
      );
      return;
    }

    let calculatedDiscount = 0;
    if (cleanCode === "FREESHIP") {
      calculatedDiscount = siteConfig.defaultShippingFee;
    } else if (coupon.type === "percentage") {
      calculatedDiscount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount) {
        calculatedDiscount = Math.min(calculatedDiscount, coupon.maxDiscount);
      }
    } else {
      calculatedDiscount = Math.min(coupon.value, subtotal);
    }

    applyCoupon({
      code: cleanCode,
      type: coupon.type,
      value: coupon.value,
      discount: calculatedDiscount,
    });

    setCouponSuccess(`Coupon ${cleanCode} applied successfully!`);
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess(null);
    setCouponError(null);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="bg-white rounded-2xl border border-cream-200/90 shadow-sm p-5 sm:p-6 space-y-5">
      <h3 className="font-serif text-xl font-bold text-choco-950 pb-2 border-b border-cream-100">
        Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-montserrat">
          {amountToFreeShipping > 0 ? (
            <span className="text-choco-700">
              Add <strong className="text-choco-950 font-bold">{fmt(amountToFreeShipping)}</strong> more for <span className="text-gold-600 font-bold">FREE Delivery</span>
            </span>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold-500" />
              You unlocked FREE Express Delivery!
            </span>
          )}
          <span className="text-choco-500 font-medium">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gold-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Coupon input */}
      <div className="space-y-2">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-montserrat">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-emerald-600" />
              <div>
                <span className="font-bold text-emerald-800 tracking-wider">
                  {appliedCoupon.code}
                </span>
                <span className="text-emerald-600 ml-1.5">
                  ({appliedCoupon.code === "FREESHIP" ? "Free Shipping" : `-${fmt(discount)}`})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              aria-label="Remove coupon"
              className="text-emerald-600 hover:text-emerald-800 p-1 hover:bg-emerald-100 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="space-y-1.5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-choco-400 pointer-events-none" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code (e.g. WELCOME10)"
                  className="w-full pl-9 pr-3 py-2 text-xs font-montserrat uppercase rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/50 text-choco-950 placeholder:normal-case placeholder:text-choco-400"
                />
              </div>
              <button
                type="submit"
                disabled={!couponCode.trim()}
                className="px-4 py-2 bg-choco-900 text-cream-50 hover:bg-choco-800 disabled:opacity-40 rounded-xl font-montserrat font-bold text-xs tracking-wide transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="text-[11px] font-sans text-red-600 pl-1">{couponError}</p>
            )}
            {couponSuccess && (
              <p className="text-[11px] font-sans text-emerald-600 pl-1">{couponSuccess}</p>
            )}
          </form>
        )}
      </div>

      {/* Financial breakdown */}
      <div className="space-y-2.5 pt-3 border-t border-cream-100 text-sm font-sans">
        <div className="flex justify-between text-choco-700">
          <span>Subtotal</span>
          <span className="font-montserrat font-semibold text-choco-900">{fmt(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Coupon Discount</span>
            <span className="font-montserrat font-bold">-{fmt(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-choco-700">
          <span>Estimated Shipping</span>
          <span className="font-montserrat font-semibold">
            {standardShipping === 0 ? (
              <span className="text-emerald-700 font-bold">FREE</span>
            ) : (
              fmt(standardShipping)
            )}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between text-choco-700">
            <span>GST / Taxes</span>
            <span className="font-montserrat font-semibold">{fmt(tax)}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline pt-3 border-t border-cream-200 text-base">
          <span className="font-serif font-bold text-choco-950 text-lg">Total Amount</span>
          <div className="text-right">
            <span className="font-serif text-2xl font-bold text-choco-950 block leading-none">
              {fmt(grandTotal)}
            </span>
            <span className="text-[10px] text-choco-400 font-sans">Inclusive of applicable taxes</span>
          </div>
        </div>
      </div>

      {/* Checkout CTA */}
      <div className="pt-2">
        <Link
          href="/checkout"
          onClick={onCheckoutClick}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 active:scale-[0.99] font-montserrat font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Trust Badges */}
      {!compact && (
        <div className="pt-4 border-t border-cream-100 grid grid-cols-1 gap-2.5 text-xs text-choco-600 font-sans">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold-600 shrink-0" />
            <span>100% Pure Couverture & Fresh Ingredients</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gold-600 shrink-0" />
            <span>Chilled, Temperature-Insulated Packaging</span>
          </div>
        </div>
      )}
    </div>
  );
};
