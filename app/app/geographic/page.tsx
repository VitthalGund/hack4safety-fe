"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Map, Filter, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiService } from "@/lib/api-services"
import useSWR from "swr"

interface GeoData {
  district: string
  total_cases: number
  conviction_rate: number
  crime_density: number
  hotspots: Array<{ name: string; cases: number }>
}

export default function GeographicPage() {
  const [filterType, setFilterType] = useState<string>("all")

  const { data: geoData, isLoading } = useSWR("/api/analytics/geographic", () => apiService.getGeographicData(), {
    revalidateOnFocus: false,
  })

  const data = geoData?.data || []

  const stats = {
    totalDistricts: data.length,
    averageConviction:
      data.length > 0
        ? (data.reduce((sum: number, d: GeoData) => sum + d.conviction_rate, 0) / data.length).toFixed(1)
        : 0,
    totalCases: data.reduce((sum: number, d: GeoData) => sum + d.total_cases, 0),
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Geographic Insights</h1>
        <p className="text-muted-foreground">Crime patterns and conviction rates by district</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Districts</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.totalDistricts}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg Conviction Rate</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.averageConviction}%</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Cases</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.totalCases}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card dark:bg-card h-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Heat Map Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-muted/30 dark:bg-muted/20 rounded-lg flex items-center justify-center border border-border">
                <p className="text-muted-foreground text-center">
                  Map visualization with Mapbox integration
                  <br />
                  <span className="text-xs">(Ready for API integration)</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="space-y-6">
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">View Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground dark:bg-card dark:border-border"
                >
                  <option value="all">All Districts</option>
                  <option value="high">High Crime</option>
                  <option value="conviction">High Conviction</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* District List */}
      <Card className="border-border bg-card dark:bg-card">
        <CardHeader>
          <CardTitle>District Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">District</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Total Cases</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Conviction Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Crime Density</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row: GeoData, idx: number) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-foreground font-medium">{row.district}</td>
                      <td className="py-3 px-4 text-foreground">{row.total_cases}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden dark:bg-muted">
                            <div
                              className="h-full bg-green-500 dark:bg-green-600"
                              style={{ width: `${row.conviction_rate}%` }}
                            />
                          </div>
                          <span className="text-foreground font-medium">{row.conviction_rate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          {row.crime_density}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
