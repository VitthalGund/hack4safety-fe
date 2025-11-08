"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Special Public Prosecutor",
    quote:
      "The network analysis feature helped us identify connections we missed for months. Game-changing for our investigations.",
    avatar: "🔵",
  },
  {
    name: "Rajesh Kumar",
    role: "Police Commissioner",
    quote:
      "Real-time analytics have significantly improved our conviction rates. The geographic insights are invaluable.",
    avatar: "🟢",
  },
  {
    name: "Maria Rodriguez",
    role: "Investigation Officer",
    quote: "The AI-powered search makes finding relevant cases incredibly fast. Saves us hours every week.",
    avatar: "🟣",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-[#1A2847] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground dark:text-white mb-4">
            Trusted by Justice Professionals
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Join hundreds of agencies improving their investigations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-xl bg-white dark:bg-[#0F1729] border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">{`"${testimonial.quote}"`}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
