"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { fetchPerformanceRanking } from "@/lib/api-services"
import { AlertCircle, TrendingUp, Award } from "lucide-react"

interface RankingData {
  name: string
  entity_type: "io" | "pp" | "unit"
  conviction_rate: number
  total_cases: number
}

export default function PerformanceRankings() {
  const [ioData, setIOData] = useState<RankingData[]>([])
  const [ppData, setPPData] = useState<RankingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"io" | "pp">("io")

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setLoading(true)
        const [ios, pps] = await Promise.all([fetchPerformanceRanking("io", 5), fetchPerformanceRanking("pp", 5)])
        setIOData(ios)
        setPPData(pps)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load rankings")
      } finally {
        setLoading(false)
      }
    }

    loadRankings()
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

  const data = activeTab === "io" ? ioData : ppData

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="p-6 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Top Performers
          </h2>
          <div className="flex gap-2">
            {(["io", "pp"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {tab === "io" ? "Investigating Officers" : "Public Prosecutors"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{person.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{person.total_cases} cases handled</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {(person.conviction_rate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">conviction rate</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
