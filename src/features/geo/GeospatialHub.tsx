"use client"
import { useState } from "react"
import { useGeoHeatmap, useGeoCases } from "@/api/apiHooks"
import { MapFilterPanel } from "./MapFilterPanel"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Zap } from "lucide-react"

export const GeospatialHub = () => {
  const [filters, setFilters] = useState<Record<string, any>>({})
  const { data: heatmapData, isLoading: heatmapLoading } = useGeoHeatmap(filters)
  const { data: casesData, isLoading: casesLoading } = useGeoCases(filters)
  const [selectedCase, setSelectedCase] = useState<any>(null)

  if (heatmapLoading || casesLoading) {
    return <LoadingSpinner message="Loading geospatial data..." />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Zap size={24} />
          Geospatial Intelligence
        </h1>
        <p className="text-muted-foreground mt-2">Crime hotspots and spatial analysis</p>
      </div>

      <div className="flex gap-6">
        {/* Filter Panel */}
        <div className="w-72 flex-shrink-0">
          <MapFilterPanel onFiltersChange={setFilters} />
        </div>

        {/* Map Area */}
        <div className="flex-1 space-y-4">
          {/* Map Placeholder */}
          <div className="bg-card border border-border rounded-lg overflow-hidden relative h-96">
            {/* Simple heatmap visualization */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/40 to-red-900/50" />

            {/* Case points */}
            <div className="absolute inset-0">
              {casesData?.map((case_: any, i: number) => {
                const x = Math.random() * 100
                const y = Math.random() * 100
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedCase(case_)}
                    className={`absolute w-3 h-3 rounded-full border-2 ${
                      case_.outcome === "convicted"
                        ? "bg-green-500 border-green-300"
                        : case_.outcome === "acquitted"
                          ? "bg-red-500 border-red-300"
                          : "bg-yellow-500 border-yellow-300"
                    } hover:scale-150 transition-transform`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    title={case_.caseId}
                  />
                )
              })}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-background/90 border border-border rounded-lg p-3 space-y-2 text-xs">
              <p className="font-semibold text-foreground">Legend</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-muted-foreground">Convicted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-muted-foreground">Acquitted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-muted-foreground">Pending</span>
              </div>
            </div>
          </div>

          {/* Case Details */}
          {selectedCase && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3">{selectedCase.caseId}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="text-foreground">{selectedCase.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Outcome</p>
                  <p className="text-foreground">{selectedCase.outcome}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
