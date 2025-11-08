"use client"
import { useState } from "react"
import { useChargesheetSankey, useInsights } from "@/api/apiHooks"
import { ChargesheetSankey } from "./ChargesheetSankey"
import { PersonnelScorecard } from "./PersonnelScorecard"
import { JudicialReport } from "./JudicialReport"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { BarChart3 } from "lucide-react"

export const AnalyticsHub = () => {
  const [activeTab, setActiveTab] = useState<"sankey" | "personnel" | "judicial">("sankey")
  const { data: chargesheetData, isLoading: chargesheetLoading } = useChargesheetSankey()
  const { data: insightsData, isLoading: insightsLoading } = useInsights()

  if (chargesheetLoading || insightsLoading) {
    return <LoadingSpinner message="Loading analytics..." />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 size={24} />
          Analytics Hub
        </h1>
        <p className="text-muted-foreground mt-2">Deep-dive case and personnel analytics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {["sankey", "personnel", "judicial"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? "text-primary border-b-primary"
                : "text-muted-foreground border-b-transparent hover:text-foreground"
            }`}
          >
            {tab === "sankey" && "Chargesheet Flow"}
            {tab === "personnel" && "Personnel Scorecard"}
            {tab === "judicial" && "Judicial Report"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border rounded-lg p-6">
        {activeTab === "sankey" && <ChargesheetSankey data={chargesheetData} />}
        {activeTab === "personnel" && <PersonnelScorecard />}
        {activeTab === "judicial" && <JudicialReport />}
      </div>

      {/* AI Insights */}
      {insightsData && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">AI-Driven Insights</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Key Drivers of Conviction</p>
              <div className="space-y-2">
                {insightsData?.drivers?.slice(0, 5).map((driver: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded h-6 flex items-center pl-3">
                      <div className="bg-primary h-4 rounded" style={{ width: `${driver.importance}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-20 text-right">{driver.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
