"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ChocolateType } from "@/types/database";

interface StepChocolateTypeProps {
  chocolateTypes: ChocolateType[];
  selectedId: number;
  onSelect: (id: number) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// Chocolate type visual accent colours
const TYPE_COLORS: Record<string, { pill: string; ring: string; bg: string; emoji: string }> = {
  "milk-couverture": {
    pill: "bg-amber-100 text-amber-800",
    ring: "ring-amber-600",
    bg: "from-amber-900/10 to-amber-800/5",
    emoji: "🍫",
  },
  "dark-couverture": {
    pill: "bg-stone-900 text-stone-100",
    ring: "ring-stone-900",
    bg: "from-stone-900/10 to-stone-800/5",
    emoji: "🖤",
  },
  "white-couverture": {
    pill: "bg-yellow-50 text-yellow-800 border border-yellow-200",
    ring: "ring-yellow-500",
    bg: "from-yellow-100/30 to-amber-50/20",
    emoji: "🤍",
  },
};

const FALLBACK = {
  pill: "bg-choco-100 text-choco-800",
  ring: "ring-choco-500",
  bg: "from-choco-50/20 to-cream-50/10",
  emoji: "🍫",
};

export function StepChocolateType({
  chocolateTypes,
  selectedId,
  onSelect,
}: StepChocolateTypeProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-choco-900">Choose Your Chocolate</h2>
        <p className="text-sm text-choco-500 font-sans mt-1">
          All bases are premium Belgian couverture — real cocoa butter, no vegetable fats.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {chocolateTypes.map((ct) => {
          const isSelected = ct.id === selectedId;
          const accent = TYPE_COLORS[ct.slug] ?? FALLBACK;

          return (
            <button
              key={ct.id}
              type="button"
              onClick={() => onSelect(ct.id)}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${ct.name}${ct.price_modifier > 0 ? `, +${fmt(ct.price_modifier)}` : ", included"}`}
              className={cn(
                "relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-gold-400",
                "hover:shadow-md hover:border-choco-300",
                isSelected
                  ? `border-choco-900 bg-gradient-to-br ${accent.bg} ring-2 ${accent.ring} shadow-md`
                  : "border-cream-200 bg-white"
              )}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-choco-900 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-cream-50" />
                </div>
              )}

              {/* Emoji + type pill */}
              <div className="flex items-center gap-2">
                <span className="text-3xl" role="img" aria-hidden="true">{accent.emoji}</span>
                <span className={cn("text-[10px] font-montserrat font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", accent.pill)}>
                  {ct.slug.split("-")[0]}
                </span>
              </div>

              {/* Name */}
              <h3 className="font-serif text-base text-choco-900 leading-snug">{ct.name}</h3>

              {/* Description */}
              {ct.description && (
                <p className="text-xs text-choco-500 font-sans leading-relaxed">
                  {ct.description}
                </p>
              )}

              {/* Price modifier */}
              <div className="mt-auto pt-2">
                {ct.price_modifier === 0 ? (
                  <span className="text-xs font-montserrat font-bold text-emerald-600">
                    Included
                  </span>
                ) : (
                  <span className="text-xs font-montserrat font-bold text-choco-700">
                    +{fmt(ct.price_modifier)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
