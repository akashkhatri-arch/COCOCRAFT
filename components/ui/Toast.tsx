"use client";

/**
 * Simple toast system — no external dependencies.
 * Usage: import { toast } from "@/components/ui/Toast"
 *        then place <ToastContainer /> once in your layout.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  action?: { label: string; onClick: () => void };
}


// ── Global imperative API ────────────────────────────────────────────────────
let _add: ((item: Omit<ToastItem, "id">) => void) | null = null;

export const toast = {
  success: (message: string, opts?: Omit<ToastItem, "id" | "message" | "variant">) =>
    _add?.({ message, variant: "success", ...opts }),
  error: (message: string, opts?: Omit<ToastItem, "id" | "message" | "variant">) =>
    _add?.({ message, variant: "error", ...opts }),
  info: (message: string, opts?: Omit<ToastItem, "id" | "message" | "variant">) =>
    _add?.({ message, variant: "info", ...opts }),
};

// ── Individual toast ─────────────────────────────────────────────────────────
function Toast({
  item,
  onRemove,
}: {
  item: ToastItem;
  onRemove: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 4s
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(item.id), 300);
    }, 4000);
    return () => clearTimeout(timerRef.current);
  }, [item.id, onRemove]);

  const Icon =
    item.variant === "success"
      ? CheckCircle2
      : item.variant === "error"
      ? AlertCircle
      : Info;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 bg-white border border-cream-200 rounded-2xl shadow-lg px-4 py-3 max-w-sm w-full transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 flex-shrink-0 mt-0.5",
          item.variant === "success"
            ? "text-emerald-600"
            : item.variant === "error"
            ? "text-rose-500"
            : "text-choco-600"
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-sans font-semibold text-choco-900">{item.message}</p>
        {item.description && (
          <p className="text-xs text-choco-500 font-sans mt-0.5 line-clamp-2">{item.description}</p>
        )}
        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action!.onClick();
              onRemove(item.id);
            }}
            className="text-xs font-montserrat font-bold text-gold-600 hover:text-gold-700 mt-1 transition-colors"
          >
            {item.action.label} →
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(item.id), 300);
        }}
        className="text-choco-300 hover:text-choco-600 transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Container (place once in layout) ────────────────────────────────────────
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const add = useCallback((item: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${++counter.current}`;
    setToasts((prev) => [...prev.slice(-4), { ...item, id }]);
  }, []);

  // Register global API
  useEffect(() => {
    _add = add;
    return () => { _add = null; };
  }, [add]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast item={t} onRemove={remove} />
        </div>
      ))}
    </div>
  );
}
