import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100",
      secondary:
        "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200",
      outline:
        "border-[3px] border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
      ghost: "text-slate-600 hover:bg-slate-100",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100",
    };

    const sizes = {
      sm: "h-11 px-5 text-[10px] md:text-xs rounded-xl",
      md: "h-14 px-8 text-xs rounded-2xl",
      lg: "h-16 px-10 text-sm rounded-[1.5rem]",
      xl: "h-20 px-12 text-lg rounded-[2rem]",
      icon: "h-12 w-12 md:h-14 md:w-14 rounded-xl p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-3 font-black uppercase tracking-[0.15em] italic transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
