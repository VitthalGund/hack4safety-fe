"use client"
import { useState } from "react"
import { Search } from "lucide-react"

export const PersonnelScorecard = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPersonnel, setSelectedPersonnel] = useState<any>(null)

  // Mock data
  const samplePersonnel = [
    {
      id: 1,
      name: "IO Rajesh Sharma",
      convictionRate: 72,
      casesDuration: 145,
      acquittalReasons: ["Insufficient Evidence", "Technical Issues"],
    },
    {
      id: 2,
      name: "PP Priya Desai",
      convictionRate: 68,
      casesDuration: 132,
      acquittalReasons: ["Witness Unavailable", "Procedural Errors"],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search IO or PP by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {samplePersonnel.map((person) => (
          <div
            key={person.id}
            onClick={() => setSelectedPersonnel(person)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedPersonnel?.id === person.id
                ? "bg-primary/10 border-primary"
                : "bg-card border-border hover:border-primary"
            }`}
          >
            <h3 className="font-semibold text-foreground">{person.name}</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conviction Rate</span>
                <span className="font-bold text-green-400">{person.convictionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Case Duration</span>
                <span className="text-foreground">{person.casesDuration} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Scorecard */}
      {selectedPersonnel && (
        <div className="bg-muted rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground text-lg">{selectedPersonnel.name} - Detailed Report</h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-background rounded p-4">
              <p className="text-xs text-muted-foreground">Conviction Rate</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{selectedPersonnel.convictionRate}%</p>
            </div>
            <div className="bg-background rounded p-4">
              <p className="text-xs text-muted-foreground">Avg. Duration</p>
              <p className="text-2xl font-bold text-foreground mt-1">{selectedPersonnel.casesDuration}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
            <div className="bg-background rounded p-4">
              <p className="text-xs text-muted-foreground">Performance</p>
              <p className="text-2xl font-bold text-primary mt-1">High</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Common Acquittal Reasons</p>
            <div className="space-y-2">
              {selectedPersonnel.acquittalReasons.map((reason: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-muted-foreground">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
