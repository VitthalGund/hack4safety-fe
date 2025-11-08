"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import KPICards from "@/components/dashboard/kpi-cards"
import ConvictionRateChart from "@/components/dashboard/conviction-rate-chart"
import PerformanceRankings from "@/components/dashboard/performance-rankings"
import CaseList from "@/components/dashboard/case-list"
import TrendsChart from "@/components/dashboard/trends-chart"
import ChargesheetSankey from "@/components/dashboard/chargesheet-sankey"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {user?.name}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Role: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.role}</span>
          </p>
        </div>

        {/* KPI Cards Section */}
        <div className="mb-8">
          <KPICards />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ConvictionRateChart />
          <TrendsChart />
        </div>

        {/* Performance Rankings */}
        <div className="mb-8">
          <PerformanceRankings />
        </div>

        {/* Chargesheet Comparison */}
        <div className="mb-8">
          <ChargesheetSankey />
        </div>

        {/* Case List */}
        <div>
          <CaseList />
        </div>
      </motion.div>
    </div>
  )
}
