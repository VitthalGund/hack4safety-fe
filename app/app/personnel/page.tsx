"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, TrendingUp, Award, Target, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { apiService } from "@/lib/api-services"
import useSWR from "swr"

interface PersonnelScore {
  id: string
  name: string
  role: string
  conviction_rate: number
  cases_handled: number
  avg_closure_days: number
  rating: number
}

export default function PersonnelPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelScore | null>(null)

  const { data: personnelData, isLoading } = useSWR(
    "/api/personnel/scorecards",
    () => apiService.getPersonnelScorecard(),
    { revalidateOnFocus: false },
  )

  const personnel = personnelData?.data || []

  const filtered = personnel.filter((p: PersonnelScore) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || p.role === roleFilter
    return matchesSearch && matchesRole
  })

  const roles = Array.from(new Set(personnel.map((p: PersonnelScore) => p.role)))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Personnel Scorecard</h1>
        <p className="text-muted-foreground">Performance metrics and ratings for all personnel</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Personnel</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{personnel.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary/40" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Conviction Rate</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {personnel.length > 0
                      ? (
                          personnel.reduce((sum: number, p: PersonnelScore) => sum + p.conviction_rate, 0) /
                          personnel.length
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500/40" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {personnel.reduce((sum: number, p: PersonnelScore) => sum + p.cases_handled, 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500/40" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                  <p className="text-xl font-bold text-foreground mt-2">
                    {personnel.length > 0
                      ? personnel.reduce((max: PersonnelScore, p: PersonnelScore) =>
                          p.conviction_rate > max.conviction_rate ? p : max,
                        ).name
                      : "N/A"}
                  </p>
                </div>
                <Award className="h-8 w-8 text-amber-500/40" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-background text-foreground dark:bg-card dark:border-border"
        >
          <option value="all">All Roles</option>
          {roles.map((role: string) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Personnel List */}
      <Card className="border-border bg-card dark:bg-card">
        <CardHeader>
          <CardTitle>Personnel Rankings</CardTitle>
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
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cases Handled</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Conviction Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Avg Days</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((person: PersonnelScore, idx: number) => (
                    <motion.tr
                      key={person.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedPersonnel(person)}
                    >
                      <td className="py-3 px-4 text-foreground font-medium">{person.name}</td>
                      <td className="py-3 px-4 text-foreground text-sm">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs dark:bg-primary/20">
                          {person.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground">{person.cases_handled}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden dark:bg-muted">
                            <div
                              className="h-full bg-green-500 dark:bg-green-600"
                              style={{ width: `${person.conviction_rate}%` }}
                            />
                          </div>
                          <span className="text-foreground font-medium text-sm">{person.conviction_rate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground">{person.avg_closure_days} days</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-4 w-4 rounded-full ${
                                i < Math.round(person.rating)
                                  ? "bg-amber-400 dark:bg-amber-500"
                                  : "bg-muted dark:bg-muted"
                              }`}
                            />
                          ))}
                        </div>
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
