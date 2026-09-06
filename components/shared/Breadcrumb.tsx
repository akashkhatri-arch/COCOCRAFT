import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumb: React.FC<{
  items: BreadcrumbItem[];
  className?: string;
}> = ({ items, className }) => (
  <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-xs font-sans", className)}>
    <Link
      href="/"
      className="text-choco-400 hover:text-choco-700 transition-colors focus-visible:outline-none focus-visible:underline"
      aria-label="Home"
    >
      <Home className="h-3.5 w-3.5" />
    </Link>
    {items.map((item, index) => (
      <span key={index} className="flex items-center gap-1.5">
        <ChevronRight className="h-3 w-3 text-choco-300" aria-hidden="true" />
        {item.href && index < items.length - 1 ? (
          <Link
            href={item.href}
            className="text-choco-400 hover:text-choco-700 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {item.label}
          </Link>
        ) : (
          <span className="text-choco-700 font-medium" aria-current="page">
            {item.label}
          </span>
        )}
      </span>
    ))}
  </nav>
);
