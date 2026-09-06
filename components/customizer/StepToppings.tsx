"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { ToppingCard } from "./ToppingCard";
import { cn } from "@/lib/utils/cn";
import type { Topping } from "@/types/database";

interface StepToppingsProps {
  toppings: Topping[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

// Group toppings by category
function groupByCategory(toppings: Topping[]): Record<string, Topping[]> {
  return toppings.reduce<Record<string, Topping[]>>((acc, t) => {
    const cat = t.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});
}

const CATEGORY_LABELS: Record<string, string> = {
  nuts: "🥜 Nuts",
  fruits: "🍓 Dried Fruits",
  crunch: "🍪 Crunchy",
  sweets: "✨ Sweets & Décor",
  other: "Other",
};

export function StepToppings({ toppings, selectedIds, onToggle }: StepToppingsProps) {
  const max = siteConfig.maxToppings;
  const remaining = max - selectedIds.length;
  const grouped = groupByCategory(toppings);
  const categories = Object.keys(grouped);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");

  const displayToppings =
    activeCategory === "all"
      ? toppings
      : (grouped[activeCategory] ?? []);

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-serif text-2xl text-choco-900">Choose Your Toppings</h2>
        <p className="text-sm text-choco-500 font-sans mt-1">
          Select up to{" "}
          <span className="font-bold text-choco-800">{max} toppings</span> to embed in your bar.
        </p>
      </div>

      {/* Counter + limit warning */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 text-sm font-sans font-semibold transition-colors",
          selectedIds.length === 0
            ? "bg-cream-100 text-choco-500"
            : remaining === 0
            ? "bg-choco-900 text-cream-50"
            : "bg-cream-100 text-choco-700"
        )}
      >
        <span
          className={cn(
            "font-montserrat font-black text-lg leading-none",
            remaining === 0 ? "text-gold-400" : "text-choco-900"
          )}
        >
          {selectedIds.length}
        </span>
        <span>/ {max} toppings selected</span>
        {remaining === 0 && (
          <span className="ml-auto text-xs font-montserrat font-bold uppercase tracking-wider text-gold-400">
            Max reached
          </span>
        )}
      </div>

      {/* Category filter tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {["all", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-montserrat font-bold tracking-wide transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-choco-900 text-cream-50"
                  : "bg-cream-100 text-choco-600 hover:bg-cream-200"
              )}
            >
              {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
            </button>
          ))}
        </div>
      )}

      {/* Toppings grid */}
      {displayToppings.length === 0 ? (
        <p className="text-choco-400 font-sans text-sm text-center py-8">
          No toppings in this category.
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {displayToppings.map((t) => (
            <ToppingCard
              key={t.id}
              topping={t}
              isSelected={selectedIds.includes(t.id)}
              isDisabled={remaining <= 0 && !selectedIds.includes(t.id)}
              onToggle={() => onToggle(t.id)}
            />
          ))}
        </div>
      )}

      {/* Toppings are optional note */}
      <p className="text-xs text-choco-400 font-sans mt-4 text-center">
        Toppings are optional — you can continue with a plain bar.
      </p>
    </div>
  );
}
