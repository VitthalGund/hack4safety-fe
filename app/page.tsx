"use client"

import { useState, useEffect } from "react"
import Header from "@/components/sections/header"
import Hero from "@/components/sections/hero"
import FeaturesGrid from "@/components/sections/features-grid"
import Statistics from "@/components/sections/statistics"
import Security from "@/components/sections/security"
import Testimonials from "@/components/sections/testimonials"
import Footer from "@/components/sections/footer"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-white dark:bg-[#0F1729] transition-colors duration-300">
      <Header />
      <Hero />
      <FeaturesGrid />
      <Statistics />
      <Security />
      <Testimonials />
      <Footer />
    </main>
  )
}
