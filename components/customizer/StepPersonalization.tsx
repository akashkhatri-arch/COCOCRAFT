"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import type { ChocolateCustomization } from "@/types/customizer";

interface StepPersonalizationProps {
  personalization: ChocolateCustomization["personalization"];
  onChange: (p: ChocolateCustomization["personalization"]) => void;
}

const MAX = siteConfig.maxPersonalizationChars;

function CharCount({ current, max }: { current: number; max: number }) {
  const isWarning = current > max * 0.8;
  const isOver = current > max;
  return (
    <span
      className={cn(
        "text-[10px] font-montserrat font-bold tabular-nums",
        isOver ? "text-rose-600" : isWarning ? "text-amber-600" : "text-choco-400"
      )}
    >
      {current} / {max}
    </span>
  );
}

export function StepPersonalization({
  personalization,
  onChange,
}: StepPersonalizationProps) {
  const { name, message } = personalization;

  const handleName = (v: string) => {
    if (v.length > MAX) return;
    onChange({ ...personalization, name: v });
  };

  const handleMessage = (v: string) => {
    if (v.length > MAX) return;
    onChange({ ...personalization, message: v });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-choco-900">Personalize It</h2>
        <p className="text-sm text-choco-500 font-sans mt-1">
          Add a name or message that will be embossed on your chocolate bar. Both fields are optional.
        </p>
      </div>

      <div className="space-y-6">
        {/* Name field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="customizer-name"
              className="block text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-500"
            >
              Name on Chocolate
            </label>
            <CharCount current={name.length} max={MAX} />
          </div>
          <input
            id="customizer-name"
            type="text"
            value={name}
            onChange={(e) => handleName(e.target.value)}
            maxLength={MAX}
            placeholder="e.g. Happy Birthday Mom"
            autoComplete="off"
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-cream-50 text-choco-900 text-sm font-sans placeholder:text-choco-300",
              "focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400 transition-all",
              name.length === MAX ? "border-amber-300" : "border-cream-200"
            )}
          />
          <p className="text-[10px] text-choco-400 font-sans mt-1.5">
            This text is embossed in the chocolate surface.
          </p>
        </div>

        {/* Message field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="customizer-message"
              className="block text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-500"
            >
              Short Message
            </label>
            <CharCount current={message.length} max={MAX} />
          </div>
          <textarea
            id="customizer-message"
            rows={3}
            value={message}
            onChange={(e) => handleMessage(e.target.value)}
            maxLength={MAX}
            placeholder="e.g. You are my sweetest adventure"
            autoComplete="off"
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-cream-50 text-choco-900 text-sm font-sans placeholder:text-choco-300",
              "focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400 transition-all resize-none",
              message.length === MAX ? "border-amber-300" : "border-cream-200"
            )}
          />
        </div>

        {/* Preview callout */}
        {(name || message) && (
          <div className="bg-choco-900/5 border border-cream-200 rounded-2xl p-4">
            <p className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold-600 mb-2">
              Preview on bar →
            </p>
            {name && (
              <p className="font-serif text-lg text-choco-900 leading-tight">{name}</p>
            )}
            {message && (
              <p className="text-xs text-choco-600 font-sans leading-relaxed mt-1">{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
