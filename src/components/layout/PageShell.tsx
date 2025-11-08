"use client"
import { Sidebar } from "./Sidebar"
import type React from "react"

import { Header } from "./Header"

export const PageShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="md:ml-64 flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
