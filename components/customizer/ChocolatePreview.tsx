"use client";

/**
 * ChocolatePreview — layered SVG/CSS illustration that updates live
 * as the user builds their chocolate.
 *
 * Architecture:
 *  Layer 1: Chocolate bar base shape (SVG)
 *  Layer 2: Chocolate type colour tint
 *  Layer 3: Topping icons (emoji/SVG overlay positioned on bar segments)
 *  Layer 4: Personalization text rendered over the top centre
 *  Layer 5: Addon glow (gift box border if selected)
 *
 * Real Supabase Storage image URLs can replace the colour tints in a later phase.
 */

import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import type { ChocolateCustomization } from "@/types/customizer";
import type { ChocolateType, Topping, ProductVariant } from "@/types/database";

interface ChocolatePreviewProps {
  config: ChocolateCustomization;
  chocolateType?: ChocolateType | null;
  selectedToppings: Topping[];
  selectedVariant?: ProductVariant | null;
  hasGiftBox: boolean;
  className?: string;
}

// Colour palette per chocolate type slug
const CHOCO_COLORS: Record<string, { bg: string; surface: string; groove: string }> = {
  "milk-couverture": {
    bg: "from-amber-800/90 to-amber-700/80",
    surface: "#8B4513",
    groove: "#6B3410",
  },
  "dark-couverture": {
    bg: "from-stone-900/95 to-stone-800/85",
    surface: "#2C1504",
    groove: "#1A0C02",
  },
  "white-couverture": {
    bg: "from-yellow-100/95 to-amber-100/80",
    surface: "#F5E6C8",
    groove: "#DFC9A0",
  },
};

const DEFAULT_COLORS = CHOCO_COLORS["milk-couverture"];

// Topping emoji mapping by category
const TOPPING_EMOJI: Record<string, string> = {
  nuts: "🥜",
  fruits: "🍓",
  crunch: "🍪",
  sweets: "✨",
};

// Deterministic positions for toppings on the bar surface (percentage based)
const TOPPING_POSITIONS = [
  { x: 22, y: 30 }, { x: 55, y: 20 }, { x: 78, y: 35 },
  { x: 35, y: 58 }, { x: 65, y: 62 }, { x: 18, y: 68 },
  { x: 50, y: 75 }, { x: 82, y: 58 }, { x: 40, y: 42 },
  { x: 70, y: 45 },
];

export function ChocolatePreview({
  config,
  chocolateType,
  selectedToppings,
  selectedVariant,
  hasGiftBox,
  className,
}: ChocolatePreviewProps) {
  const colors = chocolateType
    ? CHOCO_COLORS[chocolateType.slug] ?? DEFAULT_COLORS
    : DEFAULT_COLORS;

  // Figure out bar aspect ratio from variant weight
  const variantWeight = selectedVariant?.weight ?? 100;
  const isLarge = variantWeight >= 180;
  const isGiant = variantWeight >= 300;

  const barAspect = isGiant ? "aspect-[3/2]" : isLarge ? "aspect-[5/4]" : "aspect-[4/3]";

  // Positions for toppings — use deterministic slot system
  const toppingPositions = useMemo(() => {
    return selectedToppings.map((t, i) => ({
      topping: t,
      pos: TOPPING_POSITIONS[i % TOPPING_POSITIONS.length],
    }));
  }, [selectedToppings]);

  const personName = config.personalization.name.trim();
  const personMessage = config.personalization.message.trim();

  return (
    <div
      className={cn(
        "relative w-full select-none",
        hasGiftBox && "p-3 bg-amber-950/10 rounded-2xl border-2 border-gold-400/50",
        className
      )}
    >
      {/* Gift box ribbon indicator */}
      {hasGiftBox && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gold-400 text-choco-950 text-[9px] font-montserrat font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
          Gift Boxed
        </div>
      )}

      {/* Bar container */}
      <div
        className={cn(
          "relative w-full rounded-2xl overflow-hidden shadow-2xl",
          barAspect,
          "bg-gradient-to-br",
          colors.bg
        )}
        role="img"
        aria-label={`Custom ${chocolateType?.name ?? "chocolate"} bar preview`}
      >
        {/* SVG chocolate bar grid (segment lines) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 320"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* Bar background */}
          <rect width="400" height="320" fill={colors.surface} rx="16" />

          {/* Segment grooves — horizontal */}
          {[80, 160, 240].map((y) => (
            <line
              key={`h-${y}`}
              x1="20" y1={y} x2="380" y2={y}
              stroke={colors.groove}
              strokeWidth="3"
            />
          ))}

          {/* Segment grooves — vertical */}
          {[100, 200, 300].map((x) => (
            <line
              key={`v-${x}`}
              x1={x} y1="20" x2={x} y2="300"
              stroke={colors.groove}
              strokeWidth="3"
            />
          ))}

          {/* Outer border gloss */}
          <rect
            x="10" y="10" width="380" height="300"
            fill="none"
            stroke={colors.groove}
            strokeWidth="6"
            rx="12"
          />

          {/* Top-surface gloss highlight */}
          <rect
            x="20" y="14" width="360" height="30"
            fill="white"
            fillOpacity="0.07"
            rx="6"
          />
        </svg>

        {/* Topping overlays */}
        {toppingPositions.map(({ topping, pos }, i) => (
          <div
            key={`${topping.id}-${i}`}
            className="absolute transition-all duration-300 pointer-events-none"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(18px, 4vw, 28px)",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
              animationDelay: `${i * 60}ms`,
            }}
          >
            {TOPPING_EMOJI[topping.category] ?? "🍫"}
          </div>
        ))}

        {/* Personalization text */}
        {(personName || personMessage) && (
          <div className="absolute inset-x-0 bottom-0 pb-4 flex flex-col items-center justify-end gap-0.5 pointer-events-none">
            {personName && (
              <p
                className="font-serif text-cream-50/90 drop-shadow-sm leading-none text-center px-2 truncate max-w-full"
                style={{ fontSize: "clamp(11px, 2.5vw, 18px)" }}
              >
                {personName}
              </p>
            )}
            {personMessage && (
              <p
                className="font-sans text-cream-50/70 leading-snug text-center px-3 line-clamp-2"
                style={{ fontSize: "clamp(8px, 1.8vw, 13px)" }}
              >
                {personMessage}
              </p>
            )}
          </div>
        )}

        {/* COCOCRAFT watermark */}
        <div className="absolute top-3 right-4 pointer-events-none">
          <span
            className="font-montserrat font-black tracking-widest text-cream-50/20 uppercase"
            style={{ fontSize: "clamp(7px, 1.5vw, 11px)" }}
          >
            COCOCRAFT
          </span>
        </div>
      </div>

      {/* Preview caption */}
      <div className="mt-3 text-center">
        <p className="text-xs text-choco-500 font-sans">
          {chocolateType
            ? chocolateType.name
            : "Choose a chocolate type to see your preview"}
        </p>
        {selectedToppings.length > 0 && (
          <p className="text-[10px] text-choco-400 font-sans mt-0.5">
            with {selectedToppings.map((t) => t.name).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
