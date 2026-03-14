import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "success" | "warning" | "free";
}

export default function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        {
          "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300":
            variant === "default",
          "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300":
            variant === "brand",
          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300":
            variant === "success",
          "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300":
            variant === "warning",
          "bg-emerald-500 text-white": variant === "free",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
