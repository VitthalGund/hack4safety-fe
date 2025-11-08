"use client"

import { useState } from "react"
import Link from "next/link"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Analytics", href: "#statistics" },
    { label: "Security", href: "#security" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header className="fixed top-0 w-full bg-white/95 dark:bg-[#0F1729]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IP</span>
          </div>
          <span className="font-heading font-bold text-xl hidden sm:inline">Intelligence</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <Link
            href="/auth/login"
            className="hidden sm:block px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
          >
            Login
          </Link>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A2847]">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/auth/login"
              className="block w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-center font-medium mt-2"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
