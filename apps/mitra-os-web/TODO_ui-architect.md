# UI Architecture Plan: DukaanMitra

### Context
- **Target framework and version**: React 18, TypeScript, Vite
- **Existing design system**: None currently formalized. Moving towards a Tailwind-based atomic design system.
- **Design token source**: Tailwind CSS configuration serving as the single source of truth for colors, spacing, and typography.
- **Theming requirements**: Light mode optimized (current), extensible to dark mode via Tailwind's `dark:` variants.

### Component Plan

- [ ] **UI-PLAN-1.1 [Button]**:
  - **Atomic Level**: Atom
  - **Variants**: `primary`, `secondary`, `ghost`, `destructive`. Sizes: `sm`, `md`, `lg`, `icon`.
  - **Props**: `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`, standard `HTMLButtonElement` props.
  - **Dependencies**: `lucide-react` (for icons), `clsx`, `tailwind-merge`.

- [ ] **UI-PLAN-1.2 [Input]**:
  - **Atomic Level**: Atom
  - **Variants**: `default`, `error`.
  - **Props**: `label`, `errorText`, `helperText`, standard `HTMLInputElement` props.
  - **Dependencies**: None.

- [ ] **UI-PLAN-1.3 [Card]**:
  - **Atomic Level**: Atom / Compound Component
  - **Variants**: `default`, `interactive` (hover states).
  - **Props**: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` (Compound API).
  - **Dependencies**: None.

- [ ] **UI-PLAN-2.1 [StatWidget]**:
  - **Atomic Level**: Molecule
  - **Variants**: `default`, `trend-up`, `trend-down`.
  - **Props**: `title`, `value`, `trend`, `icon`.
  - **Dependencies**: `Card`, `lucide-react`.

- [ ] **UI-PLAN-3.1 [WhatsAppSimulator]**:
  - **Atomic Level**: Organism
  - **Variants**: `default`.
  - **Props**: `storeId`, `onTransactionLogged`.
  - **Dependencies**: `Button`, `Input`, `Card`, `geminiService`, `storeService`.

- [x] **UI-PLAN-4.1 [Waitlist & Early Access]**:
  - **Atomic Level**: Organism
  - **Implementation**: Added a high-conversion waitlist section and global beta banner to build momentum.
  - **Status**: Completed in Step 1 of Launch Strategy.

- [ ] **UI-PLAN-4.2 [Social Proof & Testimonials]**:
  - **Atomic Level**: Molecule
  - **Goal**: Add real-time "joining now" notifications to the waitlist section.

### Component Items

- [ ] **UI-ITEM-1.1 [Button Implementation]**:
  - **API**: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'; size?: 'sm' | 'md' | 'lg' | 'icon'; isLoading?: boolean; }`
  - **Accessibility**: `aria-disabled` when loading, proper focus rings (`focus-visible:ring`), accessible loading spinner announcement.
  - **Stories**: Default, All Variants, All Sizes, Loading State, Icon Only.
  - **Tests**: Renders correctly, handles click events, disabled state prevents clicks, loading state shows spinner and disables click.

- [ ] **UI-ITEM-1.2 [Input Implementation]**:
  - **API**: `interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }`
  - **Accessibility**: `aria-invalid` when error is present, `aria-describedby` linking to error/helper text, unique auto-generated IDs if not provided.
  - **Stories**: Default, With Label, With Error, Disabled.
  - **Tests**: Renders label, handles input changes, displays error message, applies correct ARIA attributes.

- [ ] **UI-ITEM-1.3 [Card Implementation]**:
  - **API**: Compound components (`Card`, `CardHeader`, `CardTitle`, `CardContent`). Extends `React.HTMLAttributes<HTMLDivElement>`.
  - **Accessibility**: Semantic HTML (e.g., `CardTitle` defaults to `h3`), proper contrast.
  - **Stories**: Simple Card, Card with Header and Footer, Interactive Card.
  - **Tests**: Renders children correctly, applies custom classNames.

### Proposed Code Changes

```tsx
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// components/ui/Button.tsx
import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const buttonVariants = {
  base: "inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
  variant: {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    destructive: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100",
  },
  size: {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-lg",
    icon: "h-10 w-10",
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          buttonVariants.base,
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
```

### Commands

Run the following to install required utility dependencies for the component architecture:

```bash
npm install clsx tailwind-merge lucide-react
```

### Quality Assurance Task Checklist

Before finalizing, verify:

- [ ] Component APIs are consistent with existing library conventions
- [ ] All components pass axe accessibility checks with zero violations
- [ ] TypeScript compiles without errors and provides accurate autocompletion
- [ ] Storybook builds successfully with all stories rendering correctly
- [ ] Unit tests pass and cover logic, interactions, and edge cases
- [ ] Bundle size impact is measured and within acceptable limits
- [ ] SSR/SSG rendering produces no hydration warnings or errors
