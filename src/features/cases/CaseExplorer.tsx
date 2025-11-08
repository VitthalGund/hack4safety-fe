"use client"
import { useState } from "react"
import { useUIStore } from "@/state/uiStore"
import { FilterPanel } from "./FilterPanel"
import { ResultsView } from "./ResultsView"
import { ChevronLeft } from "lucide-react"

export const CaseExplorer = () => {
  const { filterPanelOpen, setFilterPanelOpen } = useUIStore()
  const [filters, setFilters] = useState<Record<string, any>>({})

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Case Explorer</h1>
        <p className="text-muted-foreground mt-2">Search and filter cases across the system</p>
      </div>

      <div className="flex gap-6">
        {/* Filter Panel */}
        <div
          className={`transition-all duration-300 ${filterPanelOpen ? "w-80" : "w-0 overflow-hidden"} flex-shrink-0`}
        >
          <FilterPanel onFiltersChange={setFilters} />
        </div>

        {/* Results Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className="flex items-center gap-1 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-sm"
            >
              <ChevronLeft size={16} />
              {filterPanelOpen ? "Hide" : "Show"} Filters
            </button>
          </div>
          <ResultsView filters={filters} />
        </div>
      </div>
    </div>
  )
}
