"use client"
import { useAnalyticsTrends, useCasesSearch } from "@/api/apiHooks"
import { KPICard } from "@/components/common/KPICard"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Clock, CheckCircle, AlertCircle, BarChart3 } from "lucide-react"

export const JudicialDashboard = () => {
  const { data: trendsData, isLoading: trendsLoading } = useAnalyticsTrends({ court: "my_court" })
  const { data: casesData, isLoading: casesLoading } = useCasesSearch({ judge: "me", status: "pending" })

  if (trendsLoading || casesLoading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  const avgTrialDuration = trendsData?.avgTrialDuration || 0
  const docketClearanceRate = trendsData?.docketClearanceRate || 0

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Judicial Dashboard</h1>
        <p className="text-muted-foreground mt-2">Court case management and performance analytics</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Avg. Trial Duration"
          value={avgTrialDuration}
          unit="days"
          description="Average trial duration in my court"
          icon={<Clock size={24} />}
        />
        <KPICard
          title="Docket Clearance"
          value={`${docketClearanceRate}%`}
          description="Court docket clearance rate"
          icon={<CheckCircle size={24} />}
        />
        <KPICard
          title="Pending Cases"
          value={casesData?.length || 0}
          description="Cases awaiting judgment"
          icon={<AlertCircle size={24} />}
        />
        <KPICard
          title="Cases This Month"
          value={trendsData?.casesThisMonth || 0}
          description="Cases filed this month"
          icon={<BarChart3 size={24} />}
        />
      </div>

      {/* Pending Cases Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">My Pending Cases</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Case ID</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Accused</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Filing Date</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Days Pending</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Section</th>
              </tr>
            </thead>
            <tbody>
              {casesData?.slice(0, 5).map((case_: any) => (
                <tr key={case_.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground font-mono">{case_.caseId}</td>
                  <td className="py-3 px-4 text-foreground">{case_.accusedName}</td>
                  <td className="py-3 px-4 text-muted-foreground">{case_.filingDate}</td>
                  <td className="py-3 px-4 text-muted-foreground">{case_.daysPending}</td>
                  <td className="py-3 px-4 text-muted-foreground">{case_.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Judgements */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Judgements</h2>
        <p className="text-muted-foreground text-sm">Recent judgements data would appear here</p>
      </div>
    </div>
  )
}
