"use client";

import React from "react";
import {
  devChocolateTypes,
  devVariants,
  devToppings,
  devAddons,
} from "@/lib/data/dev-data";
import type { CustomizationJson } from "@/store/cart";

interface CustomizationDetailsProps {
  customization?: CustomizationJson | Record<string, unknown> | null;
  compact?: boolean;
}

export const CustomizationDetails: React.FC<CustomizationDetailsProps> = ({
  customization,
  compact = false,
}) => {
  if (!customization) return null;

  // Resolve base chocolate type
  const chocolateTypeName =
    (customization.chocolateTypeName as string) ||
    (customization.chocolateTypeId
      ? devChocolateTypes.find((c) => c.id === customization.chocolateTypeId)?.name
      : null);

  // Resolve variant / size
  const variantName =
    (customization.variantName as string) ||
    (customization.variantId
      ? devVariants.find((v) => v.id === customization.variantId)?.name
      : null);

  // Resolve toppings
  let toppingNames: string[] = [];
  if (Array.isArray(customization.toppingNames) && customization.toppingNames.length > 0) {
    toppingNames = customization.toppingNames as string[];
  } else if (Array.isArray(customization.toppingIds) && customization.toppingIds.length > 0) {
    toppingNames = (customization.toppingIds as unknown as number[])
      .map((id) => devToppings.find((t) => t.id === id)?.name)
      .filter((n): n is string => Boolean(n));
  }

  // Resolve personalization
  const personalization = customization.personalization as { name?: string; message?: string } | undefined;
  const customName = personalization?.name?.trim();
  const customMessage = personalization?.message?.trim();

  // Resolve addons
  let addonNames: string[] = [];
  if (Array.isArray(customization.addonNames) && customization.addonNames.length > 0) {
    addonNames = customization.addonNames as string[];
  } else if (Array.isArray(customization.addonIds) && customization.addonIds.length > 0) {
    addonNames = (customization.addonIds as unknown as number[])
      .map((id) => devAddons.find((a) => a.id === id)?.name)
      .filter((n): n is string => Boolean(n));
  }

  // Resolve gift message
  const giftMessage = (customization.giftMessage as string)?.trim();

  if (compact) {
    return (
      <div className="text-xs text-choco-600 space-y-1 font-sans">
        {chocolateTypeName && (
          <p className="line-clamp-1">
            <span className="font-semibold text-choco-800">Base:</span> {chocolateTypeName}
            {variantName ? ` · ${variantName}` : ""}
          </p>
        )}
        {toppingNames.length > 0 && (
          <p className="line-clamp-1">
            <span className="font-semibold text-choco-800">Toppings:</span> {toppingNames.join(", ")}
          </p>
        )}
        {customName && (
          <p className="line-clamp-1">
            <span className="font-semibold text-choco-800">Bar Name:</span> &ldquo;{customName}&rdquo;
          </p>
        )}
        {addonNames.length > 0 && (
          <p className="line-clamp-1">
            <span className="font-semibold text-choco-800">Extras:</span> {addonNames.join(", ")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2.5 rounded-xl bg-cream-50/80 border border-cream-200/80 p-3 text-xs space-y-2 font-sans">
      {/* Chocolate Base & Size */}
      {(chocolateTypeName || variantName) && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-montserrat font-bold text-choco-900 flex items-center gap-1">
            <span>🍫</span> Base & Size:
          </span>
          <span className="text-choco-700">
            {chocolateTypeName || "Couverture Base"}
            {variantName && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-cream-200 text-choco-800 text-[11px] font-medium">
                {variantName}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Toppings list */}
      {toppingNames.length > 0 && (
        <div className="space-y-1">
          <span className="font-montserrat font-bold text-choco-900 flex items-center gap-1">
            <span>🌰</span> Gourmet Toppings ({toppingNames.length}):
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {toppingNames.map((topping, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white border border-cream-200 text-choco-800 text-[11px] font-medium shadow-2xs"
              >
                {topping}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Personalization */}
      {(customName || customMessage) && (
        <div className="rounded-lg bg-white/70 border border-gold-200/60 p-2 space-y-1">
          <span className="font-montserrat font-bold text-gold-800 flex items-center gap-1 text-[11px]">
            <span>✍️</span> Custom Inscription
          </span>
          {customName && (
            <p className="text-choco-800">
              <span className="text-choco-500 font-medium">Engraved Name:</span>{" "}
              <strong className="font-serif italic text-choco-950">&ldquo;{customName}&rdquo;</strong>
            </p>
          )}
          {customMessage && (
            <p className="text-choco-700">
              <span className="text-choco-500 font-medium">Message:</span> &ldquo;{customMessage}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* Addons & Packaging */}
      {addonNames.length > 0 && (
        <div className="space-y-1">
          <span className="font-montserrat font-bold text-choco-900 flex items-center gap-1">
            <span>🎁</span> Packaging & Extras:
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {addonNames.map((addon, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/70 text-amber-900 text-[11px] font-medium"
              >
                {addon}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gift message card */}
      {giftMessage && (
        <div className="rounded-lg bg-white/70 border border-cream-200 p-2 text-choco-700 italic">
          <span className="not-italic font-montserrat font-semibold text-choco-900 block text-[11px] mb-0.5">
            ✉️ Included Card Note:
          </span>
          &ldquo;{giftMessage}&rdquo;
        </div>
      )}
    </div>
  );
};
