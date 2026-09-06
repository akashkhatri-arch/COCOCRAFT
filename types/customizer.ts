/**
 * Phase 5 — Customizer Types
 * Strongly typed customization payload for the COCOCRAFT chocolate builder.
 * This is the single source of truth for all customization data.
 */

/** The full customization config built by the user in the 6-step builder */
export interface ChocolateCustomization {
  productId: number;
  productSlug?: string;
  variantId: number | null;
  variantName?: string | null;
  chocolateTypeId: number;
  chocolateTypeName?: string | null;
  toppingIds: number[];
  toppingNames?: string[];
  personalization: {
    name: string;
    message: string;
  };
  addonIds: number[];
  addonNames?: string[];
  /** Gift message — only relevant when a greeting-card addon is selected */
  giftMessage: string;
  quantity: number;
}

/** Which step the builder is on (1-indexed) */
export type CustomizerStep = 1 | 2 | 3 | 4 | 5 | 6;

export const TOTAL_STEPS = 6;

export const STEP_LABELS: Record<CustomizerStep, string> = {
  1: "Chocolate Type",
  2: "Size",
  3: "Toppings",
  4: "Personalize",
  5: "Add Extras",
  6: "Review",
};

/** The result returned from the server-side validateCustomization action */
export interface ValidatedCustomizationResult {
  success: boolean;
  error?: string;
  /** Authoritative unit price (base + variant + chocolate type + toppings + addons) */
  itemSubtotal?: number;
  /** Sanitized customization payload (safe for cart storage) */
  customization?: ChocolateCustomization;
  /** Human-readable label for this configuration (for cart display) */
  configLabel?: string;
}

/** Price breakdown for display in the sidebar */
export interface CustomizerPriceBreakdown {
  basePrice: number;
  variantMod: number;
  chocolateMod: number;
  toppingsTotal: number;
  addonsTotal: number;
  itemSubtotal: number;
  quantity: number;
  subtotal: number;
}
