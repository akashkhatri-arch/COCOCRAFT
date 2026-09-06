"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import type { ProductVariant } from "@/types/database";

interface StepVariantProps {
  variants: ProductVariant[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function StepVariant({ variants, selectedId, onSelect }: StepVariantProps) {
  if (variants.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-choco-500 font-sans text-sm">
          No size options available for this product.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-choco-900">Choose Your Size</h2>
        <p className="text-sm text-choco-500 font-sans mt-1">
          All sizes use the same premium Belgian couverture and toppings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {variants.map((v) => {
          const isSelected = v.id === selectedId;
          const isOutOfStock = v.stock_quantity <= 0;

          return (
            <button
              key={v.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => !isOutOfStock && onSelect(v.id)}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${v.name}${v.price_modifier > 0 ? `, +${fmt(v.price_modifier)}` : ", included in price"}${isOutOfStock ? ", out of stock" : ""}`}
              className={cn(
                "relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 w-full",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-gold-400",
                isOutOfStock
                  ? "border-cream-200 bg-cream-50 opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "border-choco-900 bg-choco-50/30 shadow-md"
                  : "border-cream-200 bg-white hover:border-choco-300 hover:shadow-sm"
              )}
            >
              {/* Radio indicator */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  isSelected
                    ? "border-choco-900 bg-choco-900"
                    : "border-cream-300"
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-cream-50" />}
              </div>

              {/* Label area */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-base text-choco-900">{v.name}</h3>
                  {isOutOfStock && <Badge variant="error">Out of Stock</Badge>}
                  {!isOutOfStock && v.price_modifier === 0 && (
                    <Badge variant="success">Standard</Badge>
                  )}
                </div>
                {v.description && (
                  <p className="text-xs text-choco-500 font-sans mt-0.5">{v.description}</p>
                )}
              </div>

              {/* Weight + price */}
              <div className="text-right flex-shrink-0">
                {v.weight && (
                  <p className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-choco-400">
                    {v.weight}g
                  </p>
                )}
                <p className="text-sm font-montserrat font-bold text-choco-800 mt-0.5">
                  {v.price_modifier === 0 ? (
                    <span className="text-emerald-600">Included</span>
                  ) : (
                    `+${fmt(v.price_modifier)}`
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
