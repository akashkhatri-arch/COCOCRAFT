"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  ShoppingBag,
  Truck,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Tag,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomizationDetails } from "@/components/cart/CustomizationDetails";
import { useCartStore } from "@/store/cart";
import { siteConfig } from "@/config/site";
import { createOrderAction } from "@/app/actions/createOrder";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getCartSubtotal, appliedCoupon } = useCartStore();

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Karnataka",
    pincode: "",
    notes: "",
    agreeTerms: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const subtotal = mounted ? getCartSubtotal() : 0;
  const cartItems = mounted ? items : [];

  let discount = 0;
  let isFreeShipping = false;
  if (appliedCoupon) {
    if (appliedCoupon.code === "FREESHIP") {
      isFreeShipping = true;
    } else {
      discount = appliedCoupon.discount;
    }
  }

  const shipping =
    subtotal >= siteConfig.shippingThreshold || subtotal === 0 || isFreeShipping
      ? 0
      : siteConfig.defaultShippingFee;
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Full name is required (min 2 chars)";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      errors.phone = "Enter a valid 10-digit Indian phone number";
    }
    if (!formData.line1.trim() || formData.line1.trim().length < 5) {
      errors.line1 = "Address line 1 is required (min 5 characters)";
    }
    if (!formData.city.trim() || formData.city.trim().length < 2) {
      errors.city = "City is required";
    }
    if (!formData.pincode.trim() || !/^[1-9][0-9]{5}$/.test(formData.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit PIN code";
    }
    if (!formData.agreeTerms) {
      errors.agreeTerms = "You must agree to the Terms of Service to place an order";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;
    if (cartItems.length === 0) {
      setServerError("Your cart is empty. Please add items to order.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrderAction({
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: {
            line1: formData.line1.trim(),
            line2: formData.line2.trim(),
            city: formData.city.trim(),
            state: formData.state,
            pincode: formData.pincode.trim(),
            country: "India",
          },
          notes: formData.notes.trim(),
        },
        items: cartItems,
        couponCode: appliedCoupon?.code || null,
      });

      if (!res.success || !res.orderNumber) {
        setServerError(res.error || "Failed to place order. Please check your details.");
        setIsSubmitting(false);
        return;
      }

      // Route to order confirmation page
      router.push(`/order-success?orderNumber=${res.orderNumber}&orderId=${res.orderId}`);
    } catch (err) {
      console.error("Order submission error:", err);
      setServerError("A network error occurred. Please try again.");
      setIsSubmitting(false);
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-choco-700 hover:text-choco-950 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Cart</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-montserrat text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Lock className="h-3.5 w-3.5" />
              <span>Secure SSL Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-8 items-start">
            {/* Left Column: Checkout Details Form */}
            <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 sm:p-8 space-y-8">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-choco-950">
                  Shipping & Delivery Details
                </h1>
                <p className="text-xs sm:text-sm text-choco-500 font-sans mt-1">
                  Please enter where we should deliver your freshly handcrafted chocolates.
                </p>
              </div>

              {serverError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs font-sans">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block font-montserrat">Order Error</span>
                    <span>{serverError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-6">
                {/* 1. Contact Info */}
                <div className="space-y-4">
                  <h2 className="font-montserrat font-bold text-xs uppercase tracking-wider text-choco-900 pb-1 border-b border-cream-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-choco-900 text-cream-50 text-[10px] flex items-center justify-center">1</span>
                    <span>Contact Information</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Elena Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                      />
                      {formErrors.name && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                        Email Address (for order updates) *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="elena@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                        Phone Number (for delivery tracking) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-montserrat font-bold text-choco-400">
                          +91
                        </span>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="space-y-4 pt-2">
                  <h2 className="font-montserrat font-bold text-xs uppercase tracking-wider text-choco-900 pb-1 border-b border-cream-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-choco-900 text-cream-50 text-[10px] flex items-center justify-center">2</span>
                    <span>Shipping Address</span>
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="line1" className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                        Flat / House No., Apartment, Building *
                      </label>
                      <input
                        id="line1"
                        name="line1"
                        type="text"
                        value={formData.line1}
                        onChange={handleInputChange}
                        placeholder="Flat 402, Royal Palms, 12th Main"
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                      />
                      {formErrors.line1 && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.line1}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="line2" className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                        Street Address, Landmark (Optional)
                      </label>
                      <input
                        id="line2"
                        name="line2"
                        type="text"
                        value={formData.line2}
                        onChange={handleInputChange}
                        placeholder="Near Indiranagar Metro Station"
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                          City *
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Bengaluru"
                          className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                        />
                        {formErrors.city && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.city}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                          State *
                        </label>
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="pincode" className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                          PIN Code *
                        </label>
                        <input
                          id="pincode"
                          name="pincode"
                          type="text"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="560038"
                          className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/40 text-choco-950 text-sm font-sans"
                        />
                        {formErrors.pincode && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.pincode}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                        Delivery Instructions or Special Care Note (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="e.g. Leave with building security if unavailable. Fragile chocolate item."
                        className="w-full px-4 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50/40 text-choco-950 text-xs font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method Preview */}
                <div className="space-y-3 pt-2">
                  <h2 className="font-montserrat font-bold text-xs uppercase tracking-wider text-choco-900 pb-1 border-b border-cream-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-choco-900 text-cream-50 text-[10px] flex items-center justify-center">3</span>
                    <span>Payment Selection</span>
                  </h2>
                  <div className="p-4 rounded-2xl border-2 border-choco-900 bg-cream-50/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-4 border-choco-900 bg-white" />
                      <div>
                        <span className="font-montserrat font-bold text-xs text-choco-950 block">
                          Cash / UPI on Delivery (Standard Courier)
                        </span>
                        <span className="text-[11px] text-choco-500 font-sans">
                          Pay securely upon temperature-controlled arrival.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-montserrat font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Zero Surcharge
                    </span>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-choco-700 font-sans select-none">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-0.5 h-4 w-4 rounded border-cream-300 text-choco-900 focus:ring-gold-500"
                    />
                    <span>
                      I agree to the <Link href="/terms" className="underline font-medium text-choco-900 hover:text-gold-600">Terms of Service</Link> and acknowledge that COCOCRAFT chocolates are shipped via cold-chain express delivery.
                    </span>
                  </label>
                  {formErrors.agreeTerms && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.agreeTerms}</p>
                  )}
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 active:scale-[0.99] disabled:opacity-50 font-montserrat font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authorizing & Crafting Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-gold-400" />
                      <span>Confirm Order ({fmt(finalTotal)})</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Order Items & Pricing Summary */}
            <div className="bg-white rounded-3xl border border-cream-200/90 shadow-sm p-6 space-y-6 lg:sticky lg:top-28">
              <div className="flex items-center justify-between pb-3 border-b border-cream-100">
                <h3 className="font-serif text-lg font-bold text-choco-950 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-gold-600" />
                  <span>Your Order ({cartItems.length})</span>
                </h3>
                <Link href="/cart" className="text-xs font-montserrat font-bold text-gold-600 hover:underline">
                  Edit
                </Link>
              </div>

              {/* Items List */}
              <div className="divide-y divide-cream-100 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 text-xs font-sans">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <span className="font-montserrat font-bold text-choco-900 block text-xs">
                          {item.name}
                        </span>
                        <span className="text-choco-500 text-[11px]">
                          Qty: {item.quantity} × {fmt(item.price)}
                        </span>
                      </div>
                      <span className="font-montserrat font-bold text-choco-950">
                        {fmt(item.price * item.quantity)}
                      </span>
                    </div>
                    {item.customization && (
                      <CustomizationDetails customization={item.customization} compact />
                    )}
                  </div>
                ))}
              </div>

              {/* Promo code badge */}
              {appliedCoupon && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-montserrat text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Coupon {appliedCoupon.code} Applied</span>
                  </div>
                  <span className="font-bold">-{fmt(discount)}</span>
                </div>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 pt-2 border-t border-cream-100 text-xs font-sans">
                <div className="flex justify-between text-choco-700">
                  <span>Subtotal</span>
                  <span className="font-montserrat font-semibold text-choco-900">{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-montserrat font-bold">-{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-choco-700">
                  <span>Cold-Chain Express Shipping</span>
                  <span className="font-montserrat font-semibold">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : fmt(shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-cream-200 text-sm">
                  <span className="font-serif font-bold text-choco-950 text-base">Grand Total</span>
                  <span className="font-serif text-2xl font-bold text-choco-950">{fmt(finalTotal)}</span>
                </div>
              </div>

              {/* Guarantee highlights */}
              <div className="pt-2 border-t border-cream-100 space-y-2 text-[11px] text-choco-600 font-sans">
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-gold-600 shrink-0" />
                  <span>Insulated thermal packaging with ice gel packs</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-600 shrink-0" />
                  <span>100% Melt-Free Delivery Guarantee across India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
