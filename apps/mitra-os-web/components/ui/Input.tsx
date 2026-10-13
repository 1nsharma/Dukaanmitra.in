import React, { useId } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="space-y-3 w-full group">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 group-focus-within:text-indigo-600 transition-colors"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={cn(
              error ? errorId : undefined,
              helperText ? helperId : undefined,
            )}
            className={cn(
              "w-full bg-slate-50 border-[3px] border-slate-100 rounded-[1.5rem] px-6 py-5 font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-base",
              leftIcon && "pl-16",
              error &&
                "border-rose-200 focus:ring-rose-100 focus:border-rose-500",
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-[10px] font-black text-rose-500 ml-4 uppercase tracking-widest animate-in fade-in slide-in-from-top-1"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={helperId}
            className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest opacity-60"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
