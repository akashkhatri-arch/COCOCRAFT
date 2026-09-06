"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-montserrat font-bold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variants = {
      primary: "bg-choco-900 text-cream-50 hover:bg-choco-800 active:scale-[0.98] shadow-sm",
      secondary: "bg-cream-200 text-choco-950 hover:bg-cream-300 active:scale-[0.98]",
      outline: "border-2 border-choco-900 text-choco-900 hover:bg-cream-100 active:scale-[0.98]",
      ghost: "text-choco-900 hover:bg-cream-100 active:scale-[0.98]",
      destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-sm",
      link: "text-choco-900 underline-offset-4 hover:underline p-0 rounded-none bg-transparent hover:bg-transparent font-normal active:scale-100",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };

    const combinedClass = cn(baseStyles, variants[variant], sizes[size], className);

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClass}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

