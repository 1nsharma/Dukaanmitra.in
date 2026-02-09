"use client"

import * as React from "react"
import { Moon, Sun, ZapOff } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [lastTheme, setLastTheme] = React.useState<'light' | 'dark'>('light');

  // Keep track of the last non-eco theme
  React.useEffect(() => {
    if (resolvedTheme && resolvedTheme !== 'eco') {
      setLastTheme(resolvedTheme as 'light' | 'dark');
    }
  }, [resolvedTheme]);


  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'eco', icon: ZapOff, label: 'Eco' },
  ]

  const handleEcoDoubleClick = () => {
    setTheme(lastTheme);
  };

  return (
    <div className="flex gap-1 bg-secondary p-1 rounded-full border">
      {themes.map((item) => {
        const Icon = item.icon
        const isEcoButton = item.name === 'eco';
        
        return (
          <Button
            key={item.name}
            variant="ghost"
            size="sm"
            onClick={() => setTheme(item.name)}
            onDoubleClick={isEcoButton ? handleEcoDoubleClick : undefined} // Add double click handler only for eco button
            className={cn(
              "rounded-full px-4",
              // `theme` can be 'system', so we must use `resolvedTheme` for UI state.
              resolvedTheme === item.name && "bg-background text-foreground shadow-sm"
            )}
            aria-label={`Switch to ${item.name} mode` + (isEcoButton ? ". Double-click to restore colors." : "")}
          >
            <Icon className="h-[1.2rem] w-[1.2rem] mr-2" />
            <span className="capitalize">{item.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
