import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "flat" | "outline" | "glass";
}

const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default:
        "bg-white shadow-sm border border-slate-100 hover:shadow-2xl transition-all hover:scale-[1.01]",
      flat: "bg-slate-50 border-2 border-slate-100",
      outline: "bg-transparent border-[3px] border-slate-100",
      glass: "bg-white/10 backdrop-blur-xl border border-white/10",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "p-6 md:p-10 rounded-[2rem] md:rounded-[3rem]",
          variants[variant],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardBase.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 mb-8", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-slate-500 text-sm font-bold leading-relaxed italic opacity-80 uppercase tracking-tight",
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-6 md:mt-10 pt-6 md:pt-8 border-t border-slate-100",
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
