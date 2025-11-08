"use client"

interface SankeyData {
  cases: number
  sections: Array<{ name: string; value: number; outcomes: any }>
}

interface ChargesheetSankeyProps {
  data?: SankeyData
}

export const ChargesheetSankey = ({ data }: ChargesheetSankeyProps) => {
  if (!data) {
    return <p className="text-muted-foreground">No data available</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-2">Cases Chargesheeted → Sections → Outcome</h3>
        <p className="text-sm text-muted-foreground">
          This visualization shows the flow of chargesheeted cases through different law sections to their outcomes.
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="bg-muted rounded-lg p-6 overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          {/* Total Cases */}
          <div className="flex flex-col items-center">
            <div className="bg-primary text-primary-foreground w-24 h-24 rounded-lg flex items-center justify-center font-bold text-2xl">
              {data.cases}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total Cases</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center text-muted-foreground">→</div>

          {/* Sections */}
          {data.sections?.slice(0, 3).map((section, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-accent text-accent-foreground w-24 h-20 rounded-lg flex flex-col items-center justify-center text-xs font-semibold text-center p-2">
                <p>{section.name.split(" ")[0]}</p>
                <p className="text-lg mt-1">{section.value}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Section</p>
            </div>
          ))}

          {/* Arrow */}
          <div className="flex items-center text-muted-foreground">→</div>

          {/* Outcomes */}
          <div className="flex flex-col gap-3">
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold border border-green-500/50">
              Convicted
            </div>
            <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold border border-red-500/50">
              Acquitted
            </div>
            <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold border border-yellow-500/50">
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Detailed breakdown */}
      <div className="space-y-3">
        {data.sections?.map((section, i) => (
          <div key={i} className="p-3 bg-muted rounded-lg">
            <p className="font-semibold text-foreground text-sm mb-2">{section.name}</p>
            <div className="flex gap-4 text-xs">
              <div>
                <p className="text-muted-foreground">Convicted</p>
                <p className="font-bold text-green-400">{section.outcomes?.convicted || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Acquitted</p>
                <p className="font-bold text-red-400">{section.outcomes?.acquitted || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pending</p>
                <p className="font-bold text-yellow-400">{section.outcomes?.pending || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
