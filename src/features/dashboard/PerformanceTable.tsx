"use client"

interface PerformanceRow {
  id: string
  name: string
  convictionRate: number
  casesHandled: number
  avgDuration: number
  rank: number
}

interface PerformanceTableProps {
  data: PerformanceRow[]
}

export const PerformanceTable = ({ data }: PerformanceTableProps) => {
  if (!data || data.length === 0) {
    return <div className="text-muted-foreground text-sm py-8">No performance data available</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Rank</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Conviction Rate</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Cases Handled</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Avg Duration</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-semibold text-foreground">#{row.rank}</td>
              <td className="py-3 px-4 text-foreground">{row.name}</td>
              <td className="py-3 px-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                  {row.convictionRate}%
                </span>
              </td>
              <td className="py-3 px-4 text-muted-foreground">{row.casesHandled}</td>
              <td className="py-3 px-4 text-muted-foreground">{row.avgDuration} days</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
