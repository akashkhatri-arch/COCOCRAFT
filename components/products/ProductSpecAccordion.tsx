"use client";

import React, { useState } from "react";
import { ChevronDown, Cookie, AlertTriangle, Truck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ProductSpecAccordionProps {
  ingredients?: string | null;
  allergens?: string | null;
  shelfLife?: string | null;
  storageInstructions?: string | null;
}

export const ProductSpecAccordion: React.FC<ProductSpecAccordionProps> = ({
  ingredients,
  allergens,
  shelfLife,
  storageInstructions,
}) => {
  const [openSection, setOpenSection] = useState<string | null>("ingredients");

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      id: "ingredients",
      label: "Ingredients",
      icon: <Cookie className="h-4 w-4 text-choco-600" />,
      content: ingredients || "Sugar, Cocoa Butter, Cocoa Mass, Soy Lecithin, Natural Flavours.",
    },
    {
      id: "allergens",
      label: "Allergens & Dietary",
      icon: <AlertTriangle className="h-4 w-4 text-choco-600" />,
      content: allergens
        ? `Contains: ${allergens}. Processed in a facility that also handles wheat, milk, dairy, soy, and tree nuts.`
        : "Processed in a facility that handles nuts, dairy, gluten, and soy.",
    },
    {
      id: "storage",
      label: "Shelf Life & Storage",
      icon: <ShieldAlert className="h-4 w-4 text-choco-600" />,
      content: `Shelf Life: ${shelfLife || "6 Months"}. Storage Instructions: ${
        storageInstructions || "Store in a cool, dry place between 15-20°C."
      }`,
    },
    {
      id: "shipping",
      label: "Shipping & Handling",
      icon: <Truck className="h-4 w-4 text-choco-600" />,
      content:
        "Shipped in insulated cold packaging containing reusable ice gel packs to prevent transit melting. Delivered across India within 3-5 business days.",
    },
  ];

  return (
    <div className="border-t border-cream-200/50">
      {sections.map((sec) => {
        const isOpen = openSection === sec.id;
        return (
          <div key={sec.id} className="border-b border-cream-200/50">
            <button
              onClick={() => toggle(sec.id)}
              className="w-full flex items-center justify-between py-4 text-left font-montserrat font-bold text-xs uppercase tracking-wider text-choco-900 focus-visible:outline-none focus-visible:underline cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {sec.icon}
                {sec.label}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-choco-400 transition-transform",
                  isOpen && "rotate-180 text-gold-500"
                )}
              />
            </button>
            {isOpen && (
              <div className="pb-5 text-sm text-choco-700 font-sans leading-relaxed">
                {sec.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
