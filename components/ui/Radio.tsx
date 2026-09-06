import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const uniqueId = label ? id || `radio-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={uniqueId}
          className="inline-flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative flex items-center">
            <input
              id={uniqueId}
              type="radio"
              className={cn(
                "peer sr-only",
                className
              )}
              ref={ref}
              {...props}
            />
            <div className="h-5 w-5 rounded-full border border-cream-300 bg-white transition-all peer-checked:border-choco-900 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 group-hover:border-choco-400 flex items-center justify-center peer-checked:[&_div]:scale-100">
              <div className="h-2.5 w-2.5 rounded-full bg-choco-900 scale-0 transition-transform duration-200" />
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

Radio.displayName = "Radio";
