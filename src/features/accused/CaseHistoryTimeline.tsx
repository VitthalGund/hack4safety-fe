"use client"

interface CaseEvent {
  date: string
  caseId: string
  outcome: "convicted" | "acquitted" | "pending"
  section: string
  courtName: string
  description: string
}

interface CaseHistoryTimelineProps {
  cases: CaseEvent[]
}

export const CaseHistoryTimeline = ({ cases }: CaseHistoryTimelineProps) => {
  if (!cases || cases.length === 0) {
    return <p className="text-muted-foreground text-sm">No case history available</p>
  }

  return (
    <div className="space-y-6">
      {cases.map((case_, i) => (
        <div key={i} className="flex gap-4">
          {/* Timeline connector */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                case_.outcome === "convicted"
                  ? "bg-green-500 border-green-500"
                  : case_.outcome === "acquitted"
                    ? "bg-red-500 border-red-500"
                    : "bg-yellow-500 border-yellow-500"
              }`}
            />
            {i < cases.length - 1 && <div className="w-0.5 h-12 bg-border mt-2" />}
          </div>

          {/* Event content */}
          <div className="flex-1 pb-6">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{case_.caseId}</p>
                  <p className="text-xs text-muted-foreground mt-1">{case_.date}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                    case_.outcome === "convicted"
                      ? "bg-green-500/20 text-green-400"
                      : case_.outcome === "acquitted"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {case_.outcome}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-foreground">{case_.description}</p>
                <p className="text-xs text-muted-foreground">{case_.section}</p>
                <p className="text-xs text-muted-foreground">{case_.courtName}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
