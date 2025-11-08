"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, CheckCircle } from "lucide-react"

export default function Security() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Post-Quantum Cryptography",
      description: "Military-grade encryption ready for quantum computing era",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All data encrypted in transit and at rest",
    },
    {
      icon: Eye,
      title: "Audit Logging",
      description: "Complete audit trails for compliance and accountability",
    },
    {
      icon: CheckCircle,
      title: "SOC 2 Certified",
      description: "Independently verified security controls",
    },
  ]

  return (
    <section id="security" className="py-20 bg-white dark:bg-[#0F1729] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground dark:text-white mb-6">
              Enterprise Security
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Your criminal justice data deserves the highest level of protection. We implement industry-leading
              security measures to ensure complete confidentiality and integrity.
            </p>

            <div className="space-y-4">
              {securityFeatures.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-foreground dark:text-white mb-1">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-2xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-12 text-white">
              <div className="space-y-6">
                <div>
                  <p className="text-indigo-200 text-sm mb-2">Compliance Status</p>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <span className="font-bold">SOC 2 Type II</span>
                  </div>
                </div>
                <div>
                  <p className="text-indigo-200 text-sm mb-2">Data Protection</p>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <span className="font-bold">GDPR Compliant</span>
                  </div>
                </div>
                <div>
                  <p className="text-indigo-200 text-sm mb-2">Encryption Standard</p>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <span className="font-bold">AES-256 & PQC Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
