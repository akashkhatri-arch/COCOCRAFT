"use client";

import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";
import type { Addon } from "@/types/database";

interface StepAddonsProps {
  addons: Addon[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  giftMessage: string;
  onGiftMessageChange: (msg: string) => void;
  /** ID of the greeting card addon (to show gift message field) */
  greetingCardAddonId?: number;
}

const MAX_GIFT_MESSAGE = 200;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// Addon icons by slug pattern
function addonEmoji(slug: string): string {
  if (slug.includes("gift") || slug.includes("box")) return "🎁";
  if (slug.includes("card") || slug.includes("greeting")) return "💌";
  if (slug.includes("ribbon")) return "🎀";
  if (slug.includes("cold") || slug.includes("insulated")) return "❄️";
  return "✨";
}

export function StepAddons({
  addons,
  selectedIds,
  onToggle,
  giftMessage,
  onGiftMessageChange,
  greetingCardAddonId,
}: StepAddonsProps) {
  const greetingCardSelected =
    greetingCardAddonId !== undefined && selectedIds.includes(greetingCardAddonId);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-choco-900">Add Extras</h2>
        <p className="text-sm text-choco-500 font-sans mt-1">
          Elevate your chocolate gift with premium packaging and personal touches.
        </p>
      </div>

      {/* Addon cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {addons.map((addon) => {
          const isSelected = selectedIds.includes(addon.id);
          const emoji = addonEmoji(addon.slug);

          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => onToggle(addon.id)}
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`${addon.name}, ${fmt(addon.price)}${isSelected ? ", selected" : ""}`}
              className={cn(
                "relative flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 w-full",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-gold-400",
                isSelected
                  ? "border-choco-900 bg-choco-50/20 shadow-md"
                  : "border-cream-200 bg-white hover:border-choco-300 hover:shadow-sm"
              )}
            >
              {/* Selected indicator */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                  isSelected
                    ? "border-choco-900 bg-choco-900"
                    : "border-cream-300"
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-cream-50" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl" role="img" aria-hidden="true">{emoji}</span>
                  <h3 className="font-serif text-base text-choco-900">{addon.name}</h3>
                </div>
                {addon.description && (
                  <p className="text-xs text-choco-500 font-sans leading-relaxed">
                    {addon.description}
                  </p>
                )}
                <p className="text-sm font-montserrat font-bold text-choco-700 mt-2">
                  +{fmt(addon.price)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Gift message field (shown when greeting card is selected) */}
      {greetingCardSelected && (
        <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="customizer-gift-message"
                className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-500"
              >
                💌 Gift Message
              </label>
              <span className="text-[10px] font-montserrat font-bold text-choco-400 tabular-nums">
                {giftMessage.length} / {MAX_GIFT_MESSAGE}
              </span>
            </div>
            <textarea
              id="customizer-gift-message"
              rows={4}
              value={giftMessage}
              onChange={(e) => {
                if (e.target.value.length <= MAX_GIFT_MESSAGE) {
                  onGiftMessageChange(e.target.value);
                }
              }}
              maxLength={MAX_GIFT_MESSAGE}
              placeholder="e.g. Hope you have the sweetest birthday! With love ❤️"
              className={cn(
                "w-full px-4 py-3 rounded-xl border border-cream-200 bg-white text-choco-900 text-sm font-sans",
                "placeholder:text-choco-300 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400",
                "transition-all resize-none"
              )}
            />
            <p className="text-[10px] text-choco-400 font-sans mt-1.5">
              This message will be handprinted on your greeting card.
            </p>
          </div>
        </div>
      )}

      {addons.length === 0 && (
        <p className="text-choco-400 font-sans text-sm text-center py-8">
          No add-ons are currently available.
        </p>
      )}
    </div>
  );
}
