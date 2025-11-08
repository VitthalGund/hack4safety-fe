"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { fetchKPIDurations } from "@/lib/api-services"
import { AlertCircle } from "lucide-react"

interface KPIData {
  avg_investigation_days: number
  avg_trial_days: number
  avg_lifecycle_days: number
}

export default function KPICards() {
  const [data, setData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadKPIs = async () => {
      try {
        const kpiData = await fetchKPIDurations()
        setData(kpiData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load KPI data")
      } finally {
        setLoading(false)
      }
    }

    loadKPIs()
  }, [])

  const kpiCards = [
    {
      label: "Avg. Investigation Duration",
      value: data?.avg_investigation_days.toFixed(1) || "0",
      unit: "days",
      icon: "📊",
      color: "from-blue-500/20 to-blue-600/20 dark:from-blue-600/20 dark:to-blue-700/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Avg. Trial Duration",
      value: data?.avg_trial_days.toFixed(1) || "0",
      unit: "days",
      icon: "⚖️",
      color: "from-indigo-500/20 to-indigo-600/20 dark:from-indigo-600/20 dark:to-indigo-700/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
    },
    {
      label: "Avg. Case Lifecycle",
      value: data?.avg_lifecycle_days.toFixed(1) || "0",
      unit: "days",
      icon: "📈",
      color: "from-emerald-500/20 to-emerald-600/20 dark:from-emerald-600/20 dark:to-emerald-700/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 dark:border-slate-700 animate-pulse">
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpiCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card
            className={`p-6 border-2 ${card.borderColor} bg-gradient-to-br ${card.color} hover:shadow-lg transition-all dark:border-slate-700 dark:hover:shadow-lg/50 cursor-pointer hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{card.icon}</div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.label}</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{card.unit}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
