import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  icon?: string;
  slug?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function CategoryBadge({
  name,
  icon,
  slug,
  size = "md",
  className,
}: CategoryBadgeProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 font-medium rounded-full transition-colors",
    "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    "hover:bg-brand-100 hover:text-brand-700 dark:hover:bg-brand-900 dark:hover:text-brand-300",
    size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
    className
  );

  if (slug) {
    return (
      <Link href={`/products?category=${slug}`} className={classes}>
        {icon && <span>{icon}</span>}
        {name}
      </Link>
    );
  }

  return (
    <span className={classes}>
      {icon && <span>{icon}</span>}
      {name}
    </span>
  );
}
