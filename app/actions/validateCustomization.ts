"use server";

/**
 * Phase 5 — Server-Authoritative Customization Validation
 *
 * This action is the ONLY way a customized item should be priced for cart insertion.
 * It:
 *  1. Receives a raw customization payload from the browser
 *  2. Fetches every referenced entity directly from the data layer (never trusts client prices)
 *  3. Validates product is active, in-stock, and customizable
 *  4. Validates every variant/topping/addon is active
 *  5. Enforces topping limits from siteConfig
 *  6. Runs calculatePrice() using server-fetched prices
 *  7. Returns the authoritative unit price + sanitized config
 */

import {
  getProductBySlug,
  getProducts,
  getToppings,
  getChocolateTypes,
  getAddons,
} from "@/lib/data/store";
import { calculatePrice } from "@/lib/pricing/calculator";
import { siteConfig } from "@/config/site";
import type { ChocolateCustomization, ValidatedCustomizationResult } from "@/types/customizer";

export async function validateAndPriceCustomization(
  raw: ChocolateCustomization & { productSlug: string }
): Promise<ValidatedCustomizationResult> {
  try {
    // ── 1. Load product by slug (trusted server-side source) ─────────────────
    const productData = await getProductBySlug(raw.productSlug);
    if (!productData) {
      return { success: false, error: "Product not found." };
    }
    const { product, variants } = productData;

    if (!product.active) {
      return { success: false, error: "This product is no longer available." };
    }
    if (!product.is_customizable) {
      return { success: false, error: "This product cannot be customized." };
    }
    if (product.stock_quantity <= 0) {
      return { success: false, error: "This product is currently out of stock." };
    }

    // ── 2. Validate variant ──────────────────────────────────────────────────
    let variantPriceModifier = 0;
    const selectedVariant = variants.find(
      (v) => v.id === raw.variantId && v.active && v.stock_quantity > 0
    );
    if (raw.variantId !== null && raw.variantId !== undefined) {
      if (!selectedVariant) {
        return { success: false, error: "Selected size is unavailable. Please choose another." };
      }
      variantPriceModifier = selectedVariant.price_modifier;
    }

    // ── 3. Validate chocolate type ───────────────────────────────────────────
    const allChocolateTypes = await getChocolateTypes();
    const chocolateType = allChocolateTypes.find(
      (ct) => ct.id === raw.chocolateTypeId && ct.active
    );
    if (!chocolateType) {
      return { success: false, error: "Selected chocolate type is unavailable." };
    }

    // ── 4. Validate toppings ─────────────────────────────────────────────────
    if (raw.toppingIds.length > siteConfig.maxToppings) {
      return {
        success: false,
        error: `You can select a maximum of ${siteConfig.maxToppings} toppings.`,
      };
    }

    const allToppings = await getToppings();
    const selectedToppings = raw.toppingIds.map((id) => {
      const topping = allToppings.find((t) => t.id === id && t.active);
      return topping ?? null;
    });

    if (selectedToppings.some((t) => t === null)) {
      return { success: false, error: "One or more selected toppings are no longer available." };
    }

    const toppingsForCalc = (selectedToppings as NonNullable<typeof selectedToppings[0]>[]).map(
      (t) => ({ price: t.price, quantity: 1 })
    );

    // ── 5. Validate add-ons ──────────────────────────────────────────────────
    const allAddons = await getAddons();
    const selectedAddons = raw.addonIds.map((id) => {
      const addon = allAddons.find((a) => a.id === id && a.active);
      return addon ?? null;
    });

    if (selectedAddons.some((a) => a === null)) {
      return { success: false, error: "One or more selected add-ons are no longer available." };
    }

    const addonsForCalc = (selectedAddons as NonNullable<typeof selectedAddons[0]>[]).map((a) => ({
      price: a.price,
    }));

    // ── 6. Validate quantity ─────────────────────────────────────────────────
    if (!Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > 20) {
      return { success: false, error: "Quantity must be between 1 and 20." };
    }

    // ── 7. Validate personalization ──────────────────────────────────────────
    const name = (raw.personalization?.name ?? "").trim().slice(0, siteConfig.maxPersonalizationChars);
    const message = (raw.personalization?.message ?? "").trim().slice(0, siteConfig.maxPersonalizationChars);
    const giftMessage = (raw.giftMessage ?? "").trim().slice(0, 200);

    // ── 8. Run authoritative price calculation ───────────────────────────────
    const pricing = calculatePrice({
      basePrice: product.base_price,
      variantPriceModifier,
      chocolatePriceModifier: chocolateType.price_modifier,
      toppings: toppingsForCalc,
      addons: addonsForCalc,
      quantity: raw.quantity,
    });

    // ── 9. Build sanitized config ────────────────────────────────────────────
    const sanitizedConfig: ChocolateCustomization = {
      productId: product.id,
      productSlug: product.slug,
      variantId: raw.variantId,
      variantName: selectedVariant?.name ?? null,
      chocolateTypeId: chocolateType.id,
      chocolateTypeName: chocolateType.name,
      toppingIds: selectedToppings.map((t) => t!.id),
      toppingNames: selectedToppings.map((t) => t!.name),
      personalization: { name, message },
      addonIds: selectedAddons.map((a) => a!.id),
      addonNames: selectedAddons.map((a) => a!.name),
      giftMessage,
      quantity: raw.quantity,
    };

    // Human-readable label for cart display
    const toppingNames = selectedToppings.map((t) => t!.name).join(", ");
    const configLabel = [
      chocolateType.name,
      toppingNames || "No Toppings",
      name ? `"${name}"` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    return {
      success: true,
      itemSubtotal: pricing.itemSubtotal,
      customization: sanitizedConfig,
      configLabel,
    };
  } catch (err) {
    console.error("[validateAndPriceCustomization] Unexpected error:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Lightweight helper — fetches only customizable products (used by the /customize picker).
 */
export async function getCustomizableProducts() {
  return getProducts({ customizableOnly: true, inStockOnly: true });
}
