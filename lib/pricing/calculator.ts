import { siteConfig } from "@/config/site";

export interface PricingInput {
  basePrice: number;
  variantPriceModifier?: number;
  chocolatePriceModifier?: number;
  toppings: { price: number; quantity: number }[];
  addons: { price: number }[];
  quantity: number;
  coupon?: {
    type: "percentage" | "fixed";
    value: number;
    minimumOrderValue?: number;
    maximumDiscount?: number | null;
  };
}

export interface PricingSummary {
  itemSubtotal: number; // Unit price with customizations
  quantity: number;
  subtotal: number; // itemSubtotal * quantity
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
}

/**
 * Centrally calculates order/item prices authoritatively on server.
 */
export function calculatePrice(input: PricingInput): PricingSummary {
  // 1. Calculate individual item customized price
  const base = input.basePrice;
  const variantMod = input.variantPriceModifier || 0;
  const chocolateMod = input.chocolatePriceModifier || 0;
  
  const toppingsTotal = input.toppings.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );
  
  const addonsTotal = input.addons.reduce(
    (acc, curr) => acc + curr.price,
    0
  );

  const itemSubtotal = base + variantMod + chocolateMod + toppingsTotal + addonsTotal;
  const subtotal = itemSubtotal * input.quantity;

  // 2. Coupon Discount Calculation
  let discount = 0;
  if (input.coupon) {
    const minOrderVal = input.coupon.minimumOrderValue || 0;
    
    if (subtotal >= minOrderVal) {
      if (input.coupon.type === "percentage") {
        discount = (subtotal * input.coupon.value) / 100;
        if (input.coupon.maximumDiscount) {
          discount = Math.min(discount, input.coupon.maximumDiscount);
        }
      } else {
        discount = Math.min(input.coupon.value, subtotal);
      }
    }
  }

  // 3. Shipping Fee calculation
  const netSubtotal = subtotal - discount;
  const shippingFee =
    netSubtotal >= siteConfig.shippingThreshold || netSubtotal <= 0
      ? 0
      : siteConfig.defaultShippingFee;

  // 4. Tax calculation (0 by default, configured via siteConfig)
  const tax = Math.round(((netSubtotal * siteConfig.taxRate) / 100) * 100) / 100;

  const total = Math.max(0, netSubtotal + shippingFee + tax);

  return {
    itemSubtotal,
    quantity: input.quantity,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
  };
}
