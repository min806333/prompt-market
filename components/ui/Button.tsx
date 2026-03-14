import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

interface ButtonAsButton
  extends ButtonBaseProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  children?: React.ReactNode;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

function getClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    {
      "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow-md":
        variant === "primary",
      "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700":
        variant === "secondary",
      "border-2 border-brand-600 text-brand-600 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-950":
        variant === "outline",
      "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800":
        variant === "ghost",
    },
    {
      "px-3 py-1.5 text-sm gap-1.5": size === "sm",
      "px-5 py-2.5 text-sm gap-2": size === "md",
      "px-7 py-3.5 text-base gap-2.5": size === "lg",
    },
    className
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = getClasses(variant, size, className);

  if ("href" in props && props.href !== undefined) {
    const { href, target, rel, onClick } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} target={target} rel={rel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = props as ButtonAsButton & {
    href?: undefined;
  };
  return (
    <button ref={ref} className={classes} {...buttonProps}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
