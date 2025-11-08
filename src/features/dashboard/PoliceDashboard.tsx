"use client"
import { useAnalyticsConvictionRate, useAnalyticsTrends, useAnalyticsPerformanceRanking } from "@/api/apiHooks"
import { KPICard } from "@/components/common/KPICard"
import { TrendChart } from "./TrendChart"
import { PerformanceTable } from "./PerformanceTable"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { TrendingUp, Users, Briefcase, Target } from "lucide-react"

export const PoliceDashboard = () => {
  const { data: convictionData, isLoading: convictionLoading } = useAnalyticsConvictionRate()
  const { data: trendsData, isLoading: trendsLoading } = useAnalyticsTrends()
  const { data: performanceData, isLoading: performanceLoading } = useAnalyticsPerformanceRanking()

  if (convictionLoading || trendsLoading || performanceLoading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  const convictionRate = convictionData?.rate || 0
  const avgCaseLifecycle = convictionData?.avgDays || 0

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Police Dashboard</h1>
        <p className="text-muted-foreground mt-2">Law enforcement analytics and performance metrics</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Conviction Rate"
          value={`${convictionRate}%`}
          trend={convictionData?.trend || 0}
          description="Overall conviction success rate"
          icon={<Target size={24} />}
        />
        <KPICard
          title="Avg. Case Lifecycle"
          value={avgCaseLifecycle}
          unit="days"
          description="Average time from FIR to verdict"
          icon={<Briefcase size={24} />}
        />
        <KPICard
          title="Active Cases"
          value={convictionData?.activeCases || 0}
          description="Currently pending cases"
          icon={<Users size={24} />}
        />
        <KPICard
          title="Heinous Crimes"
          value={trendsData?.heinousCrimes || 0}
          trend={trendsData?.heinousTrend || 0}
          description="Heinous vs non-heinous ratio"
          icon={<TrendingUp size={24} />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crime Trends Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Crime Trends</h2>
          <TrendChart data={trendsData?.monthlyData || []} />
        </div>

        {/* Quick Stats */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Case Distribution</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Chargesheeted</span>
              <span className="font-semibold text-foreground">{convictionData?.chargesheeted || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Under Investigation</span>
              <span className="font-semibold text-foreground">{convictionData?.underInvestigation || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Convicted</span>
              <span className="font-semibold text-foreground">{convictionData?.convicted || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Acquitted</span>
              <span className="font-semibold text-foreground">{convictionData?.acquitted || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Rankings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Top IOs/Units Performance</h2>
        <PerformanceTable data={performanceData || []} />
      </div>
    </div>
  )
}
