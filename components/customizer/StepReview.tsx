"use client";

import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Badge } from "@/components/ui/Badge";
import type { ChocolateCustomization } from "@/types/customizer";
import type { Product, ProductVariant, ChocolateType, Topping, Addon } from "@/types/database";

interface StepReviewProps {
  config: ChocolateCustomization;
  product: Product;
  variant: ProductVariant | null;
  chocolateType: ChocolateType | null;
  selectedToppings: Topping[];
  selectedAddons: Addon[];
  onQuantityChange: (qty: number) => void;
  validationError: string | null;
}

interface ReviewRowProps {
  label: string;
  value: string;
}
function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-cream-100 last:border-b-0">
      <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600 w-28 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-choco-800 font-sans leading-snug flex-1">{value}</span>
    </div>
  );
}

export function StepReview({
  config,
  product,
  variant,
  chocolateType,
  selectedToppings,
  selectedAddons,
  onQuantityChange,
  validationError,
}: StepReviewProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-choco-900">Review Your Order</h2>
        <p className="text-sm text-choco-500 font-sans mt-1">
          Everything looks great? Set your quantity and add to cart.
        </p>
      </div>

      {/* Configuration summary */}
      <div className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden mb-6">
        <div className="px-5 py-3 bg-cream-100 border-b border-cream-200">
          <p className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
            Your Configuration
          </p>
        </div>
        <div className="px-5">
          <ReviewRow label="Product" value={product.name} />
          <ReviewRow
            label="Size"
            value={variant ? `${variant.name}${variant.weight ? ` · ${variant.weight}g` : ""}` : "Standard"}
          />
          <ReviewRow
            label="Chocolate"
            value={chocolateType?.name ?? "Not selected"}
          />
          <ReviewRow
            label="Toppings"
            value={
              selectedToppings.length > 0
                ? selectedToppings.map((t) => t.name).join(", ")
                : "None"
            }
          />
          {config.personalization.name && (
            <ReviewRow label="Name" value={config.personalization.name} />
          )}
          {config.personalization.message && (
            <ReviewRow label="Message" value={config.personalization.message} />
          )}
          {selectedAddons.length > 0 && (
            <ReviewRow
              label="Add-ons"
              value={selectedAddons.map((a) => a.name).join(", ")}
            />
          )}
          {config.giftMessage && (
            <ReviewRow label="Gift Note" value={config.giftMessage} />
          )}
        </div>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-cream-200 mb-4">
        <div>
          <p className="font-serif text-base text-choco-900">How many bars?</p>
          <p className="text-xs text-choco-500 font-sans mt-0.5">Maximum 20 per order.</p>
        </div>
        <QuantitySelector
          value={config.quantity}
          onChange={onQuantityChange}
          min={1}
          max={20}
        />
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-sans mb-4">
          ⚠️ {validationError}
        </div>
      )}

      {/* Freshness badge */}
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="success">Made to Order</Badge>
        <Badge variant="success">Belgian Couverture</Badge>
        {selectedAddons.some((a) => a.slug.includes("gift") || a.slug.includes("box")) && (
          <Badge variant="gold">Gift Boxed</Badge>
        )}
      </div>
    </div>
  );
}
