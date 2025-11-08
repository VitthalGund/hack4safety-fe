"use client"
import { useState } from "react"
import { useCasesSearch } from "@/api/apiHooks"
import { useUIStore } from "@/state/uiStore"
import { CaseDetailModal } from "./CaseDetailModal"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Grid2x2, List } from "lucide-react"

interface ResultsViewProps {
  filters: Record<string, any>
}

export const ResultsView = ({ filters }: ResultsViewProps) => {
  const { data: cases, isLoading } = useCasesSearch(filters)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const { selectedCaseId, setSelectedCaseId } = useUIStore()

  if (isLoading) {
    return <LoadingSpinner message="Searching cases..." />
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No cases found matching your filters.</p>
        <p className="text-xs text-muted-foreground mt-2">Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Results</h2>
          <p className="text-sm text-muted-foreground mt-1">{cases.length} case(s) found</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "table" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <Grid2x2 size={18} />
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Case ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Accused</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Section</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Court</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Judge</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((case_: any) => (
                  <tr
                    key={case_.id}
                    onClick={() => setSelectedCase(case_.id)}
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono text-foreground">{case_.caseId}</td>
                    <td className="py-3 px-4 text-foreground">{case_.accusedName}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{case_.section}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{case_.court}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{case_.judge}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          case_.status === "convicted"
                            ? "bg-green-500/20 text-green-400"
                            : case_.status === "acquitted"
                              ? "bg-red-500/20 text-red-400"
                              : case_.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {case_.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{case_.filingDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((case_: any) => (
            <div
              key={case_.id}
              onClick={() => setSelectedCase(case_.id)}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-lg hover:border-primary transition-all cursor-pointer space-y-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-mono font-semibold text-foreground">{case_.caseId}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                    case_.status === "convicted"
                      ? "bg-green-500/20 text-green-400"
                      : case_.status === "acquitted"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {case_.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-foreground font-medium">{case_.accusedName}</p>
                <p className="text-muted-foreground text-xs">{case_.section}</p>
                <p className="text-muted-foreground text-xs">{case_.court}</p>
              </div>
              <div className="pt-2 border-t border-border text-xs text-muted-foreground">{case_.filingDate}</div>
            </div>
          ))}
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCase && <CaseDetailModal caseId={selectedCase} onClose={() => setSelectedCase(null)} />}
    </div>
  )
}
