"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Statistics() {
  const [stats, setStats] = useState({
    convictionRate: 0,
    avgDuration: 0,
    totalCases: 0,
    activePersonnel: 0,
  })

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API calls
    setStats({
      convictionRate: 87.5,
      avgDuration: 245,
      totalCases: 10250,
      activePersonnel: 520,
    })
  }, [])

  const statCards = [
    {
      label: "Conviction Rate",
      value: `${stats.convictionRate}%`,
      change: "+2.3%",
      description: "vs last quarter",
    },
    {
      label: "Avg Trial Duration",
      value: `${stats.avgDuration} days`,
      change: "-15 days",
      description: "improvement",
    },
    {
      label: "Total Cases",
      value: stats.totalCases.toLocaleString(),
      change: "+1,250",
      description: "this year",
    },
    {
      label: "Active Personnel",
      value: stats.activePersonnel,
      change: "+45",
      description: "onboarded",
    },
  ]

  return (
    <section id="statistics" className="py-20 bg-gray-50 dark:bg-[#1A2847] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground dark:text-white mb-4">
            Platform Analytics
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Real-time insights from across your jurisdiction</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-xl bg-white dark:bg-[#0F1729] border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-indigo-500/10 transition-all"
            >
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{stat.label}</p>
              <div className="mb-4">
                <p className="text-3xl font-heading font-bold text-foreground dark:text-white">{stat.value}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
