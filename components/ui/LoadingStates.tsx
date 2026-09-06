import { cn } from "@/lib/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rect" | "circle";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rect",
  ...props
}) => (
  <div
    className={cn(
      "animate-pulse bg-cream-200",
      variant === "circle" && "rounded-full",
      variant === "text" && "rounded h-4",
      variant === "rect" && "rounded-xl",
      className
    )}
    aria-hidden="true"
    {...props}
  />
);

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-sm">
    <Skeleton className="aspect-square w-full" />
    <div className="p-5 space-y-3">
      <Skeleton variant="text" className="w-2/3 h-3" />
      <Skeleton variant="text" className="w-full h-5" />
      <Skeleton variant="text" className="w-3/4 h-4" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" className="w-16 h-6" />
        <Skeleton className="w-28 h-10 rounded-full" />
      </div>
    </div>
  </div>
);

export const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({
  size = "md",
  className,
}) => {
  const sizes = { sm: "h-4 w-4 border-2", md: "h-7 w-7 border-2", lg: "h-10 w-10 border-[3px]" };
  return (
    <div
      className={cn(
        "rounded-full border-cream-300 border-t-choco-700 animate-spin",
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};
