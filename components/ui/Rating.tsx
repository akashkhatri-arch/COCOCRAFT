"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 5,
  readOnly = true,
  size = "md",
  className,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const starSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleStarClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        readOnly ? "cursor-default" : "cursor-pointer",
        className
      )}
    >
      {Array.from({ length: max }).map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = hoverValue !== null ? ratingValue <= hoverValue : ratingValue <= value;

        return (
          <Star
            key={index}
            onClick={() => handleStarClick(ratingValue)}
            onMouseEnter={() => !readOnly && setHoverValue(ratingValue)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            className={cn(
              starSizes[size],
              "transition-colors",
              isFilled ? "fill-gold-500 text-gold-500" : "text-cream-300 fill-transparent",
              !readOnly && "hover:scale-110 active:scale-95 transform duration-100"
            )}
            role={readOnly ? "presentation" : "button"}
            aria-label={!readOnly ? `Rate ${ratingValue} stars out of ${max}` : undefined}
          />
        );
      })}
    </div>
  );
};
