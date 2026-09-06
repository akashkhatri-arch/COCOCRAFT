import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, label, id, ...props }, ref) => {
    const uniqueId = label ? id || `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={uniqueId}
            className="text-xs font-montserrat font-bold uppercase tracking-wider text-choco-700 select-none"
          >
            {label}
          </label>
        )}
        <input
          id={uniqueId}
          type={type}
          className={cn(
            "flex w-full h-11 px-4 rounded-lg border border-cream-200 bg-white font-sans text-sm text-choco-950 transition-colors placeholder:text-choco-300 focus:outline-none focus:border-gold-500 disabled:opacity-50 disabled:bg-cream-50",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-sans font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
