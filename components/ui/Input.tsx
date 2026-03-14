import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border text-sm transition-colors",
            "bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
            "placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
            error
              ? "border-red-400 dark:border-red-500"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
