"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check localStorage and system preference
    const stored = localStorage.getItem("theme") as Theme | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (stored) {
      setTheme(stored)
      if (stored === "dark") {
        document.documentElement.classList.add("dark")
      }
    } else if (prefersDark) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }

    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light"
      localStorage.setItem("theme", newTheme)

      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      return newTheme
    })
  }

  if (!mounted) return children

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    return {
      theme: "light" as Theme,
      toggleTheme: () => {
        const isDark = document.documentElement.classList.contains("dark")
        if (isDark) {
          document.documentElement.classList.remove("dark")
          localStorage.setItem("theme", "light")
        } else {
          document.documentElement.classList.add("dark")
          localStorage.setItem("theme", "dark")
        }
      },
    }
  }
  return context
}
