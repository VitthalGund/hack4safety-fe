"use client"
import { useState } from "react"
import { Search } from "lucide-react"
import { AccusedProfile } from "./AccusedProfile"

export const AccusedExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAccusedId, setSelectedAccusedId] = useState<string | null>(null)

  if (selectedAccusedId) {
    return (
      <div>
        <button
          onClick={() => setSelectedAccusedId(null)}
          className="mb-6 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Search
        </button>
        <AccusedProfile accusedId={selectedAccusedId} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Accused Profiles</h1>
        <p className="text-muted-foreground mt-2">Search and view 360° accused profiles</p>
      </div>

      {/* Search Box */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search by name, ID, or case number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
          />
        </div>

        {/* Sample results */}
        {searchQuery && (
          <div className="mt-6 space-y-2">
            <div
              onClick={() => setSelectedAccusedId("1")}
              className="p-4 bg-muted rounded-lg hover:bg-accent/20 cursor-pointer transition-colors"
            >
              <p className="font-semibold text-foreground">Rajesh Kumar</p>
              <p className="text-sm text-muted-foreground">ID: ACC-001 | 8 cases</p>
            </div>
            <div
              onClick={() => setSelectedAccusedId("2")}
              className="p-4 bg-muted rounded-lg hover:bg-accent/20 cursor-pointer transition-colors"
            >
              <p className="font-semibold text-foreground">Priya Singh</p>
              <p className="text-sm text-muted-foreground">ID: ACC-002 | 3 cases</p>
            </div>
          </div>
        )}
      </div>

      {/* Information Card */}
      {!searchQuery && (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Enter a name or ID to view 360° accused profiles</p>
        </div>
      )}
    </div>
  )
}
