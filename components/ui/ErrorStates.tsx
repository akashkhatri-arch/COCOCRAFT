import * as React from "react";
import { AlertCircle, Wifi, PackageOpen, SearchX } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ─── Generic Error Message ─────────────────────────────────────────────────
export const ErrorMessage: React.FC<{ message: string; className?: string }> = ({
  message,
  className,
}) => (
  <div
    className={cn(
      "flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600",
      className
    )}
    role="alert"
  >
    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
    <span className="font-sans">{message}</span>
  </div>
);

// ─── Empty State ───────────────────────────────────────────────────────────
interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nothing here yet",
  message = "There's nothing to show right now.",
  action,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-20 px-6 text-center",
      className
    )}
  >
    <div className="mb-5 rounded-full bg-cream-100 p-5">
      <PackageOpen className="h-10 w-10 text-choco-400" />
    </div>
    <h3 className="font-serif text-2xl text-choco-800 mb-2">{title}</h3>
    <p className="text-sm text-choco-500 font-sans max-w-xs leading-relaxed mb-6">{message}</p>
    {action}
  </div>
);

// ─── Not Found State ───────────────────────────────────────────────────────
export const NotFoundState: React.FC<{
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({
  title = "Not Found",
  message = "The page or item you're looking for doesn't exist.",
  action,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-20 px-6 text-center",
      className
    )}
  >
    <div className="mb-5 rounded-full bg-cream-100 p-5">
      <SearchX className="h-10 w-10 text-choco-400" />
    </div>
    <h3 className="font-serif text-2xl text-choco-800 mb-2">{title}</h3>
    <p className="text-sm text-choco-500 font-sans max-w-xs leading-relaxed mb-6">{message}</p>
    {action}
  </div>
);

// ─── Network Error ─────────────────────────────────────────────────────────
export const NetworkError: React.FC<{
  onRetry?: () => void;
  className?: string;
}> = ({ onRetry, className }) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-20 px-6 text-center",
      className
    )}
  >
    <div className="mb-5 rounded-full bg-cream-100 p-5">
      <Wifi className="h-10 w-10 text-choco-400" />
    </div>
    <h3 className="font-serif text-2xl text-choco-800 mb-2">Connection Error</h3>
    <p className="text-sm text-choco-500 font-sans max-w-xs leading-relaxed mb-6">
      Something went wrong loading this content. Please check your connection.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-sm hover:bg-choco-800 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);
