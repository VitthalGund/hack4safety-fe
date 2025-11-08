"use client"
import { useState } from "react"
import { RotateCcw } from "lucide-react"

interface MapFilterPanelProps {
  onFiltersChange: (filters: Record<string, any>) => void
}

export const MapFilterPanel = ({ onFiltersChange }: MapFilterPanelProps) => {
  const [filters, setFilters] = useState<Record<string, any>>({})

  const handleChange = (key: string, value: any) => {
    const updated = { ...filters, [key]: value || undefined }
    setFilters(updated)
    onFiltersChange(Object.fromEntries(Object.entries(updated).filter(([_, v]) => v)))
  }

  const resetFilters = () => {
    setFilters({})
    onFiltersChange({})
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <button onClick={resetFilters} className="text-xs px-2 py-1 hover:bg-muted rounded transition-colors">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">From Date</label>
        <input
          type="date"
          value={filters.dateFrom || ""}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">To Date</label>
        <input
          type="date"
          value={filters.dateTo || ""}
          onChange={(e) => handleChange("dateTo", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Nature of Offence */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Nature of Offence</label>
        <select
          value={filters.offenceType || ""}
          onChange={(e) => handleChange("offenceType", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">All Offences</option>
          <option value="heinous">Heinous Crimes</option>
          <option value="nonheinous">Non-Heinous</option>
          <option value="violent">Violent</option>
          <option value="property">Property</option>
        </select>
      </div>

      {/* Outcome */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Outcome</label>
        <select
          value={filters.outcome || ""}
          onChange={(e) => handleChange("outcome", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">All Outcomes</option>
          <option value="convicted">Convicted</option>
          <option value="acquitted">Acquitted</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* District */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">District</label>
        <select
          value={filters.district || ""}
          onChange={(e) => handleChange("district", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">All Districts</option>
          <option value="north">North District</option>
          <option value="south">South District</option>
          <option value="east">East District</option>
          <option value="west">West District</option>
        </select>
      </div>
    </div>
  )
}
