"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { fetchConvictionRate } from "@/lib/api-services"
import { AlertCircle, Loader2 } from "lucide-react"

interface ConvictionData {
  name: string
  total: number
  convicted: number
  acquitted: number
  rate: number
}

export default function ConvictionRateChart() {
  const [data, setData] = useState<ConvictionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groupBy, setGroupBy] = useState<"District" | "Court_Name" | "io">("District")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchConvictionRate(groupBy)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load conviction data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [groupBy])

  const chartData = data.map((item) => ({
    name: item.name,
    "Conviction Rate": Math.round(item.rate * 100),
    Convictions: item.convicted,
    Acquittals: item.acquitted,
    Total: item.total,
  }))

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="p-6 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Conviction Rate Analysis</h2>
          <div className="flex gap-2">
            {(["District", "Court_Name", "io"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setGroupBy(option)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  groupBy === option
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                By {option === "Court_Name" ? "Court" : option === "io" ? "IO" : option}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis label={{ value: "Rate (%)", angle: -90, position: "insideLeft" }} tick={{ fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
                formatter={(value) => (typeof value === "number" ? value.toFixed(1) : value)}
              />
              <Legend />
              <Bar dataKey="Conviction Rate" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Convictions" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Acquittals" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  )
}
