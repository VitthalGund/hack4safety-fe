"use client"

export const JudicialReport = () => {
  const judges = [
    {
      name: "Justice H.S. Reddy",
      court: "District Court, Bangalore",
      avgDuration: 210,
      conviction: 65,
      acquittal: 25,
      pending: 10,
    },
    {
      name: "Justice A.K. Misra",
      court: "High Court, Chennai",
      avgDuration: 185,
      conviction: 72,
      acquittal: 18,
      pending: 10,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {judges.map((judge, i) => (
          <div key={i} className="bg-muted rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">{judge.name}</h3>
              <p className="text-sm text-muted-foreground">{judge.court}</p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Avg. Trial Duration</span>
                  <span className="font-semibold text-foreground">{judge.avgDuration} days</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-2">Outcome Distribution</p>
                <div className="flex gap-2 h-6 bg-background rounded-full overflow-hidden">
                  <div
                    className="bg-green-500"
                    style={{ width: `${judge.conviction}%` }}
                    title={`Convicted: ${judge.conviction}%`}
                  />
                  <div
                    className="bg-red-500"
                    style={{ width: `${judge.acquittal}%` }}
                    title={`Acquitted: ${judge.acquittal}%`}
                  />
                  <div
                    className="bg-yellow-500"
                    style={{ width: `${judge.pending}%` }}
                    title={`Pending: ${judge.pending}%`}
                  />
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-muted-foreground">Conviction: {judge.conviction}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-muted-foreground">Acquittal: {judge.acquittal}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-muted-foreground">Pending: {judge.pending}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
