"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Zap, FileText, Users, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface SearchResult {
  id: string
  title: string
  category: "case" | "accused" | "location"
  href: string
  icon: React.ReactNode
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Case #2024-001",
    category: "case",
    href: "/app/cases/1",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "2",
    title: "John Doe Profile",
    category: "accused",
    href: "/app/accused/1",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "3",
    title: "Mumbai District",
    category: "location",
    href: "/app/geographic?district=mumbai",
    icon: <MapPin className="w-4 h-4" />,
  },
]

export function SearchCommand() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockResults.filter((result) => result.title.toLowerCase().includes(query.toLowerCase()))
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  return (
    <>
      {/* Search Trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 dark:text-slate-400 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-auto text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">⌘K</kbd>
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-white dark:bg-slate-950 rounded-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                  <Search className="w-5 h-5 text-slate-400" />
                  <Input
                    autoFocus
                    placeholder="Search cases, accused, locations..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-0 focus:ring-0 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <motion.button
                    onClick={() => {
                      setIsOpen(false)
                      setQuery("")
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  </motion.button>
                </div>

                {/* Results */}
                {results.length > 0 && (
                  <motion.div className="max-h-96 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {results.map((result, i) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={result.href}
                          onClick={() => {
                            setIsOpen(false)
                            setQuery("")
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors"
                        >
                          <div className="text-indigo-600 dark:text-indigo-400">{result.icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {result.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{result.category}</p>
                          </div>
                          <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1, x: 2 }}>
                            <Zap className="w-4 h-4 text-amber-500" />
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* No Results */}
                {query.length > 0 && results.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-slate-500 dark:text-slate-400">No results found for "{query}"</p>
                  </div>
                )}

                {/* Footer */}
                {results.length === 0 && query.length === 0 && (
                  <div className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                    <p className="mb-2 font-medium">Quick Links</p>
                    <div className="space-y-1">
                      <p>Type to search cases, accused, and locations</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
