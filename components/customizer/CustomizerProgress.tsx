"use client";

import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";
import { STEP_LABELS, TOTAL_STEPS } from "@/types/customizer";
import type { CustomizerStep } from "@/types/customizer";

interface CustomizerProgressProps {
  currentStep: CustomizerStep;
  onStepClick?: (step: CustomizerStep) => void;
  completedSteps: Set<CustomizerStep>;
}

export function CustomizerProgress({
  currentStep,
  onStepClick,
  completedSteps,
}: CustomizerProgressProps) {
  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => (i + 1) as CustomizerStep);

  return (
    <div className="w-full">
      {/* Step label */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600">
          Step {currentStep} of {TOTAL_STEPS}
        </p>
        <p className="text-xs text-choco-700 font-sans font-semibold">
          {STEP_LABELS[currentStep]}
        </p>
      </div>

      {/* Progress bar (mobile-friendly) */}
      <div className="relative h-1 bg-cream-200 rounded-full mb-6 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-choco-800 to-choco-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Step dots (desktop) */}
      <div className="hidden md:flex items-center justify-between gap-2">
        {steps.map((step) => {
          const isCompleted = completedSteps.has(step);
          const isCurrent = step === currentStep;
          const isClickable = isCompleted && onStepClick;

          return (
            <button
              key={step}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step)}
              aria-label={`Go to step ${step}: ${STEP_LABELS[step]}`}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 flex-1 transition-all disabled:cursor-default",
                isClickable && "cursor-pointer group"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-montserrat font-bold transition-all",
                  isCurrent &&
                    "border-choco-900 bg-choco-900 text-cream-50 shadow-md",
                  isCompleted && !isCurrent &&
                    "border-choco-800 bg-choco-800 text-cream-50 group-hover:bg-choco-700",
                  !isCompleted && !isCurrent &&
                    "border-cream-300 bg-white text-choco-400"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  step
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] font-montserrat font-bold uppercase tracking-wider leading-tight text-center",
                  isCurrent ? "text-choco-900" : "text-choco-400"
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
