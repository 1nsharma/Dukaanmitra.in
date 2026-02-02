"use client"

import * as React from "react"
import { Moon, Sun, Leaf } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: 'light', icon: Sun },
    { name: 'dark', icon: Moon },
    { name: 'eco', icon: Leaf },
  ]

  return (
    <div className="flex gap-1 bg-secondary p-1 rounded-full border">
      {themes.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.name}
            variant="ghost"
            size="icon"
            onClick={() => setTheme(item.name)}
            className={cn(
              "rounded-full",
              theme === item.name && "bg-card text-card-foreground shadow-sm"
            )}
            aria-label={`Switch to ${item.name} mode`}
          >
            <Icon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{item.name} Mode</span>
          </Button>
        )
      })}
    </div>
  )
}
