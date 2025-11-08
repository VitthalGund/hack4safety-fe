"use client"

interface TrendChartProps {
  data: Array<{ month: string; heinous: number; nonHeinous: number }>
}

export const TrendChart = ({ data }: TrendChartProps) => {
  if (!data || data.length === 0) {
    return <div className="text-muted-foreground text-sm py-8">No data available</div>
  }

  const max = Math.max(...data.flatMap((d) => [d.heinous, d.nonHeinous]))

  return (
    <div className="space-y-4">
      {/* Simple bar chart */}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.month} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">{item.month}</span>
              <span className="font-semibold text-foreground">{item.heinous + item.nonHeinous}</span>
            </div>
            <div className="flex gap-1 h-6 bg-muted rounded-sm overflow-hidden">
              <div className="bg-accent" style={{ width: `${(item.heinous / max) * 100}%` }} />
              <div className="bg-primary" style={{ width: `${(item.nonHeinous / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 pt-4 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-sm" />
          <span className="text-muted-foreground">Heinous Crimes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-sm" />
          <span className="text-muted-foreground">Non-Heinous</span>
        </div>
      </div>
    </div>
  )
}
