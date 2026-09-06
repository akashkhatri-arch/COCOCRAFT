import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const uniqueId = label ? id || `toggle-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={uniqueId}
          className="inline-flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative flex items-center">
            <input
              id={uniqueId}
              type="checkbox"
              className={cn(
                "peer sr-only",
                className
              )}
              ref={ref}
              {...props}
            />
            <div className="h-6 w-11 rounded-full border border-cream-300 bg-cream-200 transition-colors peer-checked:bg-choco-900 peer-checked:border-choco-900 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 flex items-center p-0.5 peer-checked:[&_div]:translate-x-5">
              <div className="h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200" />
            </div>
          </div>
          {label && (
            <span className="text-sm font-sans text-choco-800 group-hover:text-choco-950 transition-colors">
              {label}
            </span>
          )}
        </label>
        {error && <span className="text-xs text-red-500 font-sans font-medium pl-14">{error}</span>}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";
