"use client"

import { motion } from "framer-motion"
import { Search, Network, MapPin, TrendingUp, Brain, Users } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Advanced Case Intelligence",
    description: "Search and analyze criminal cases with powerful filters and AI-backed insights.",
  },
  {
    icon: Network,
    title: "Network Analysis",
    description: "Visualize connections between accused individuals and uncover criminal networks.",
  },
  {
    icon: MapPin,
    title: "Geographic Insights",
    description: "Track conviction patterns across districts with interactive mapping.",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Monitor personnel effectiveness and track prosecution metrics.",
  },
  {
    icon: Brain,
    title: "AI-Powered RAG",
    description: "Query case data using natural language processing and retrieval augmentation.",
  },
  {
    icon: Users,
    title: "Collaboration Tools",
    description: "Share insights and collaborate across teams in real-time.",
  },
]

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-[#0F1729] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to manage criminal justice data with precision and confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-8 rounded-xl bg-gray-50 dark:bg-[#1A2847] border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl dark:hover:shadow-indigo-500/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <Icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
