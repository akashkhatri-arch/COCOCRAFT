import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "flat";
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = "default",
  hover = false,
  children,
  ...props
}) => {
  const variants = {
    default: "bg-white border border-cream-200 shadow-sm",
    elevated: "bg-white shadow-lg border border-cream-100",
    outlined: "bg-transparent border-2 border-cream-200",
    flat: "bg-cream-50",
  };

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden",
        variants[variant],
        hover && "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("p-5 pb-3", className)} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("px-5 py-3", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("px-5 pt-3 pb-5 border-t border-cream-100", className)} {...props}>
    {children}
  </div>
);
