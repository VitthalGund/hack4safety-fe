"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { fetchChargesheetComparison } from "@/lib/api-services"
import { AlertCircle, Loader2 } from "lucide-react"

interface SankeyData {
  nodes: Array<{ id: string }>
  links: Array<{ source: string; target: string; value: number }>
}

export default function ChargesheetSankey() {
  const [data, setData] = useState<SankeyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchChargesheetComparison()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chargesheet data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (error) {
    return (
      <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-6 dark:border-slate-700">
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      </Card>
    )
  }

  // Create a simple flow visualization since Nivo Sankey is complex
  // We'll use a custom SVG-based visualization
  const links = data?.links || []
  const totalValue = links.reduce((sum, link) => sum + link.value, 0)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="p-6 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Chargesheet to Outcome Flow</h2>

        <div className="space-y-4">
          {links.slice(0, 8).map((link, index) => {
            const percentage = (link.value / totalValue) * 100
            const isConviction = link.target.includes("Conviction")

            return (
              <motion.div
                key={`${link.source}-${link.target}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                      {link.source.replace("Chargesheeted: ", "")}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      to {link.target.replace("Outcome: ", "")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">{link.value}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full h-8 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className={`h-full rounded-full transition-all ${
                      isConviction
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                        : "bg-gradient-to-r from-orange-500 to-orange-600"
                    }`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">Total Cases:</span> {totalValue}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            This visualization shows the flow from chargesheeted sections of law to case outcomes.
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
