"use client";

import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";
import type { Topping } from "@/types/database";

interface ToppingCardProps {
  topping: Topping;
  isSelected: boolean;
  isDisabled: boolean; // maxToppings reached and this is NOT selected
  onToggle: () => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// Emoji icons per topping category (used when no image is available)
const CATEGORY_EMOJI: Record<string, string> = {
  nuts: "🥜",
  fruits: "🍓",
  crunch: "🍪",
  sweets: "✨",
};

export function ToppingCard({
  topping,
  isSelected,
  isDisabled,
  onToggle,
}: ToppingCardProps) {
  const emoji = CATEGORY_EMOJI[topping.category] ?? "🎉";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isDisabled && !isSelected}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${topping.name}, ${fmt(topping.price)}${isSelected ? ", selected" : ""}${isDisabled && !isSelected ? ", maximum toppings reached" : ""}`}
      className={cn(
        "relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 text-center w-full",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-1 focus-visible:ring-gold-400",
        isSelected
          ? "border-choco-900 bg-choco-50/30 shadow-md"
          : isDisabled
          ? "border-cream-100 bg-cream-50/50 opacity-40 cursor-not-allowed"
          : "border-cream-200 bg-white hover:border-choco-300 hover:shadow-sm cursor-pointer"
      )}
    >
      {/* Selected check or deselect icon */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-choco-900 flex items-center justify-center">
          <Check className="h-3 w-3 text-cream-50" />
        </div>
      )}

      {/* Image or emoji */}
      <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center text-2xl overflow-hidden">
        {topping.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={topping.image_url} alt={topping.name} className="w-full h-full object-cover" />
        ) : (
          <span role="img" aria-hidden="true">{emoji}</span>
        )}
      </div>

      {/* Name */}
      <p className="text-xs font-sans font-semibold text-choco-900 leading-snug line-clamp-2">
        {topping.name}
      </p>

      {/* Price */}
      <p className="text-[10px] font-montserrat font-bold text-choco-600">
        +{fmt(topping.price)}
      </p>
    </button>
  );
}
