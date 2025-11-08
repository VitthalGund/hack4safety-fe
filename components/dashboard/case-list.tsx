"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { searchCases } from "@/lib/api-services"
import { AlertCircle, Search } from "lucide-react"

interface CaseItem {
  _id: string
  Case_Number: string
  Police_Station: string
  District: string
  Investigating_Officer: string
  Accused_Name: string
  Sections_of_Law: string
  Result: string
}

export default function CaseList() {
  const [cases, setCases] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [resultFilter, setResultFilter] = useState<string>("")

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true)
        const filters = resultFilter ? { result: resultFilter } : undefined
        const data = await searchCases(searchQuery || "", filters, 0, 10)
        setCases(data.items || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cases")
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(loadCases, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, resultFilter])

  const getResultColor = (result: string) => {
    if (result === "Conviction") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    if (result === "Acquittal") return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
    return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
  }

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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Recent Cases</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search cases by number, accused name, or IO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Results</option>
            <option value="Conviction">Conviction</option>
            <option value="Acquittal">Acquittal</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : cases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Case Number</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Accused</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">IO</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">District</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Result</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseItem, index) => (
                  <motion.tr
                    key={caseItem._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{caseItem.Case_Number}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{caseItem.Accused_Name}</td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{caseItem.Investigating_Officer}</td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{caseItem.District}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getResultColor(caseItem.Result)}`}
                      >
                        {caseItem.Result}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No cases found. Try adjusting your search criteria.</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
