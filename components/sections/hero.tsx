"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = 600

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      opacity: number
    }> = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const animate = () => {
      ctx.fillStyle =
        getComputedStyle(document.documentElement).getPropertyValue("--dark-background").trim() || "#0F1729"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()

        particles.forEach((p2) => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - distance / 150) * 0.3})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section className="relative pt-20 pb-20 overflow-hidden bg-gradient-to-b from-dark-background to-[#1A2847] dark:from-[#0F1729] dark:to-[#1A2847]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6">
            <span className="text-indigo-400 font-medium text-sm">AI-Powered Intelligence Platform</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight text-balance"
        >
          Precision in Criminal Justice
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl"
        >
          Advanced conviction analytics empowered by AI. Analyze cases, identify networks, and drive data-backed
          decisions across your entire jurisdiction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 transition-all hover:shadow-2xl hover:shadow-indigo-600/50">
            Start Investigation
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 rounded-full border border-gray-600 hover:border-gray-400 text-white font-bold hover:bg-white/5 transition-all">
            View Documentation
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-3 gap-8 w-full"
        >
          {[
            { number: "10K+", label: "Cases Processed" },
            { number: "98%", label: "Accuracy Rate" },
            { number: "50+", label: "Districts" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-indigo-400">{stat.number}</div>
              <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
