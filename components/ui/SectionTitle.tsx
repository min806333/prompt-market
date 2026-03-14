import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  badge?: string;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  align = "left",
  badge,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "", className)}>
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
