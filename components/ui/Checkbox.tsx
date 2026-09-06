import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const uniqueId = label ? id || `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined;

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
            <div className="h-5 w-5 rounded border border-cream-300 bg-white transition-all peer-checked:bg-choco-900 peer-checked:border-choco-900 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 group-hover:border-choco-400 group-hover:peer-checked:bg-choco-800 flex items-center justify-center text-white peer-checked:[&_svg]:opacity-100">
              <svg
                className="h-3 w-3 fill-none stroke-current stroke-3 opacity-0 transition-opacity"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          {label && (
            <span className="text-sm font-sans text-choco-800 group-hover:text-choco-950 transition-colors">
              {label}
            </span>
          )}
        </label>
        {error && <span className="text-xs text-red-500 font-sans font-medium pl-8">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
