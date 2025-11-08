"use client"
import { useState, useEffect } from "react"
import { useMetadataFields } from "@/api/apiHooks"
import { useDebounce } from "@/hooks/useDebounce"
import { Search, RotateCcw } from "lucide-react"

interface FilterPanelProps {
  onFiltersChange: (filters: Record<string, any>) => void
}

export const FilterPanel = ({ onFiltersChange }: FilterPanelProps) => {
  const { data: metadata } = useMetadataFields()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [searchText, setSearchText] = useState("")
  const debouncedSearch = useDebounce(searchText, 300)

  // Update filters when metadata changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      caseNumber: debouncedSearch,
    }))
  }, [debouncedSearch])

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange(Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)))
  }, [filters, onFiltersChange])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const resetFilters = () => {
    setFilters({})
    setSearchText("")
  }

  if (!metadata) {
    return <div className="text-muted-foreground text-sm">Loading filters...</div>
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6 sticky top-24 max-h-[calc(100vh-150px)] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-xs px-2 py-1 hover:bg-muted rounded transition-colors text-muted-foreground"
          title="Reset all filters"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Search Box */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Case Number/FIR</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search case..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Sections of Law */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Section of Law</label>
        <select
          value={filters.section || ""}
          onChange={(e) => handleFilterChange("section", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">All Sections</option>
          {metadata?.sections?.map((s: string) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Court Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Court</label>
        <select
          value={filters.court || ""}
          onChange={(e) => handleFilterChange("court", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">All Courts</option>
          {metadata?.courts?.map((c: string) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Judge */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Judge</label>
        <select
          value={filters.judge || ""}
          onChange={(e) => handleFilterChange("judge", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">All Judges</option>
          {metadata?.judges?.map((j: string) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">District</label>
        <select
          value={filters.district || ""}
          onChange={(e) => handleFilterChange("district", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">All Districts</option>
          {metadata?.districts?.map((d: string) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* IO Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Investigating Officer</label>
        <select
          value={filters.io || ""}
          onChange={(e) => handleFilterChange("io", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">All IOs</option>
          {metadata?.investigatingOfficers?.map((io: string) => (
            <option key={io} value={io}>
              {io}
            </option>
          ))}
        </select>
      </div>

      {/* Case Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Status</label>
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="chargesheeted">Chargesheeted</option>
          <option value="under_investigation">Under Investigation</option>
          <option value="convicted">Convicted</option>
          <option value="acquitted">Acquitted</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Filing Date From</label>
        <input
          type="date"
          value={filters.dateFrom || ""}
          onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Filing Date To</label>
        <input
          type="date"
          value={filters.dateTo || ""}
          onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>
    </div>
  )
}
