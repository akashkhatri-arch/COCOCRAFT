"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className,
}) => {
  // Trap focus + close on Escape
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-choco-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={cn(
              "relative w-full bg-white rounded-2xl shadow-xl overflow-hidden z-10",
              modalSizes[size],
              className
            )}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-cream-100">
                <h2 className="font-serif text-xl text-choco-950">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="text-choco-400 hover:text-choco-900 transition-colors rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {!title && (
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-10 text-choco-400 hover:text-choco-900 transition-colors rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Drawer ───────────────────────────────────────────────────────────────────
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  className,
}) => {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const slideFrom = side === "right" ? { x: "100%" } : { x: "-100%" };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-choco-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={cn(
              "absolute top-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col z-10",
              side === "right" ? "right-0" : "left-0",
              className
            )}
            initial={slideFrom}
            animate={{ x: 0 }}
            exit={slideFrom}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-100 flex-shrink-0">
              {title && <h2 className="font-serif text-xl text-choco-950">{title}</h2>}
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="ml-auto text-choco-400 hover:text-choco-900 transition-colors rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Confirmation Dialog ──────────────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-choco-600 leading-relaxed mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <button
        onClick={onClose}
        className="px-5 py-2.5 rounded-full font-montserrat font-bold text-sm text-choco-700 hover:bg-cream-100 transition-colors"
      >
        {cancelLabel}
      </button>
      <button
        onClick={() => { onConfirm(); onClose(); }}
        className={cn(
          "px-5 py-2.5 rounded-full font-montserrat font-bold text-sm transition-colors",
          variant === "destructive"
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-choco-900 text-cream-50 hover:bg-choco-800"
        )}
      >
        {confirmLabel}
      </button>
    </div>
  </Modal>
);
