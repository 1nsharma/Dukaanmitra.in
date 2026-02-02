
"use client"

import * as React from "react"
import { Moon, Sun, Leaf } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'eco', icon: Leaf, label: 'CO2' },
  ]

  return (
    <div className="flex gap-1 bg-secondary p-1 rounded-full border">
      {themes.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.name}
            variant="ghost"
            size="sm"
            onClick={() => setTheme(item.name)}
            className={cn(
              "rounded-full px-4",
              theme === item.name && "bg-background text-foreground shadow-sm"
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
