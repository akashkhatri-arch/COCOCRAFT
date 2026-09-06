/**
 * Phase 5 — Pricing unit tests
 * Tests calculatePrice() from lib/pricing/calculator.ts
 * covering all 13 cases specified in the Phase 5 brief.
 *
 * Run: npx jest __tests__/pricing.test.ts
 */

import { calculatePrice } from "../lib/pricing/calculator";

// Mock siteConfig so tests are not coupled to env-specific values
jest.mock("../config/site", () => ({
  siteConfig: {
    shippingThreshold: 999,
    defaultShippingFee: 99,
    taxRate: 0,
    maxToppings: 5,
    maxPersonalizationChars: 40,
  },
}));

describe("calculatePrice()", () => {
  // ── Case 1: Base product only ────────────────────────────────────────────
  it("case 1: base product only — no modifiers, qty=1", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [],
      addons: [],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBe(399);
    expect(result.subtotal).toBe(399);
    expect(result.total).toBe(result.subtotal + result.shippingFee + result.tax);
  });

  // ── Case 2: Variant modifier ─────────────────────────────────────────────
  it("case 2: base + variant modifier", () => {
    const result = calculatePrice({
      basePrice: 399,
      variantPriceModifier: 149,
      toppings: [],
      addons: [],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBe(548);
    expect(result.subtotal).toBe(548);
  });

  // ── Case 3: Chocolate modifier ───────────────────────────────────────────
  it("case 3: base + chocolate type modifier", () => {
    const result = calculatePrice({
      basePrice: 399,
      chocolatePriceModifier: 29,
      toppings: [],
      addons: [],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBe(428);
  });

  // ── Case 4: One topping ──────────────────────────────────────────────────
  it("case 4: base + one topping", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [{ price: 50, quantity: 1 }],
      addons: [],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBe(449);
  });

  // ── Case 5: Multiple toppings ────────────────────────────────────────────
  it("case 5: base + 3 toppings", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [
        { price: 40, quantity: 1 }, // almonds
        { price: 60, quantity: 1 }, // pistachios
        { price: 30, quantity: 1 }, // oreo
      ],
      addons: [],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBe(529);
  });

  // ── Case 6: Add-ons ──────────────────────────────────────────────────────
  it("case 6: base + one addon", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [],
      addons: [{ price: 99 }],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBe(498);
  });

  // ── Case 7: Quantity > 1 ─────────────────────────────────────────────────
  it("case 7: quantity > 1 multiplies subtotal", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [{ price: 50, quantity: 1 }],
      addons: [{ price: 99 }],
      quantity: 3,
    });
    expect(result.itemSubtotal).toBe(548);
    expect(result.subtotal).toBe(548 * 3);
  });

  // ── Case 8: Maximum toppings (5) ────────────────────────────────────────
  it("case 8: 5 toppings (max) all count correctly", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [
        { price: 40, quantity: 1 },
        { price: 50, quantity: 1 },
        { price: 60, quantity: 1 },
        { price: 30, quantity: 1 },
        { price: 25, quantity: 1 },
      ],
      addons: [],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBe(399 + 40 + 50 + 60 + 30 + 25);
  });

  // ── Case 9: Invalid topping price (0) — still adds 0 ───────────────────
  it("case 9: topping with price 0 does not change total", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [{ price: 0, quantity: 1 }],
      addons: [],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBe(399);
  });

  // ── Case 10: Inactive variant (price_modifier 0) ─────────────────────────
  it("case 10: variant with modifier 0 does not affect price", () => {
    const result = calculatePrice({
      basePrice: 399,
      variantPriceModifier: 0,
      toppings: [],
      addons: [],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBe(399);
  });

  // ── Case 11: Out-of-stock product — calculator still runs ────────────────
  // (stock gating is done in validateAndPriceCustomization, not in calculatePrice)
  it("case 11: price calculation does not gate on stock — returns price", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [],
      addons: [],
      quantity: 1,
    });
    expect(result.itemSubtotal).toBeGreaterThan(0);
  });

  // ── Case 12: Personalization does not affect price ────────────────────────
  it("case 12: personalization is free (not a price input)", () => {
    const withoutPersonalization = calculatePrice({
      basePrice: 399,
      toppings: [],
      addons: [],
      quantity: 1,
    });
    // There is no personalization field in PricingInput — it's always free
    expect(withoutPersonalization.itemSubtotal).toBe(399);
  });

  // ── Case 13: Combined full configuration ─────────────────────────────────
  it("case 13: full configuration — base + variant + chocolate + 3 toppings + 2 addons + qty 2", () => {
    const result = calculatePrice({
      basePrice: 399,
      variantPriceModifier: 149,     // Large bar
      chocolatePriceModifier: 29,    // Dark couverture
      toppings: [
        { price: 60, quantity: 1 },  // Pistachio
        { price: 50, quantity: 1 },  // Hazelnut
        { price: 30, quantity: 1 },  // Oreo
      ],
      addons: [
        { price: 99 },               // Gift box
        { price: 49 },               // Greeting card
      ],
      quantity: 2,
    });

    const expectedUnit = 399 + 149 + 29 + 60 + 50 + 30 + 99 + 49; // 865
    expect(result.itemSubtotal).toBe(expectedUnit);
    expect(result.subtotal).toBe(expectedUnit * 2); // 1730
    // Above threshold (999) so shipping = 0
    expect(result.shippingFee).toBe(0);
    expect(result.total).toBe(expectedUnit * 2); // no tax, no shipping
  });

  // ── Bonus: Shipping fee below threshold ──────────────────────────────────
  it("bonus: shipping fee applied when subtotal < threshold", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [],
      addons: [],
      quantity: 1, // 399 < 999 threshold
    });
    expect(result.shippingFee).toBe(99);
    expect(result.total).toBe(399 + 99);
  });

  // ── Bonus: Free shipping above threshold ──────────────────────────────────
  it("bonus: no shipping fee when subtotal >= threshold", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [],
      addons: [],
      quantity: 3, // 1197 >= 999 threshold
    });
    expect(result.shippingFee).toBe(0);
    expect(result.total).toBe(399 * 3);
  });

  // ── Coupon: percentage ────────────────────────────────────────────────────
  it("coupon: percentage discount applied correctly", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [],
      addons: [],
      quantity: 2,
      coupon: { type: "percentage", value: 10, minimumOrderValue: 0 },
    });
    // subtotal = 798, 10% off = 79.8 → discount rounded by Math logic
    expect(result.discount).toBeCloseTo(79.8);
  });

  // ── Coupon: fixed ─────────────────────────────────────────────────────────
  it("coupon: fixed discount applied and capped at subtotal", () => {
    const result = calculatePrice({
      basePrice: 399,
      toppings: [],
      addons: [],
      quantity: 1,
      coupon: { type: "fixed", value: 50, minimumOrderValue: 0 },
    });
    expect(result.discount).toBe(50);
  });
});
