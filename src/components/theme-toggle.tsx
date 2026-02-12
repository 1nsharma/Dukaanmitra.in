"use client"

import * as React from "react"
import { Moon, Sun, ZapOff } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [lastTheme, setLastTheme] = React.useState<'light' | 'dark'>('light');

  // When mounted on client, now we can show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Keep track of the last non-eco theme
  React.useEffect(() => {
    if (resolvedTheme && resolvedTheme !== 'eco') {
      setLastTheme(resolvedTheme as 'light' | 'dark');
    }
  }, [resolvedTheme]);

  if (!mounted) {
    return (
      <div className="flex gap-1 bg-secondary p-1 rounded-full border h-10 w-[274px] items-center justify-evenly">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    )
  }

  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'eco', icon: ZapOff, label: 'Eco' },
  ]

  const handleEcoClick = () => {
    if (theme === 'eco') {
      setTheme(lastTheme);
    } else {
      setTheme('eco');
    }
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
            onClick={isEcoButton ? handleEcoClick : () => setTheme(item.name)}
            className={cn(
              "rounded-full px-4",
              // `theme` can be 'system', so we must use `resolvedTheme` for UI state.
              resolvedTheme === item.name && "bg-background text-foreground shadow-sm"
            )}
            aria-label={`Switch to ${item.name} mode`}
          >
            <Icon className="h-[1.2rem] w-[1.2rem] mr-2" />
            <span className="capitalize">{item.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
