"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ChevronRight, Calendar, Users, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api-services"
import useSWR from "swr"

interface Case {
  id: string
  case_number: string
  fir_number: string
  status: string
  accused_count: number
  sections_charged: string[]
  investigation_start: string
  created_at: string
}

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const {
    data: casesData,
    isLoading,
    error,
  } = useSWR("/api/cases/search", () => apiService.searchCases({ query: searchTerm, limit: 50 }), {
    revalidateOnFocus: false,
  })

  const cases = casesData?.data || []

  const filteredCases = filterStatus === "all" ? cases : cases.filter((c: Case) => c.status === filterStatus)

  const statusColors: Record<string, string> = {
    investigation: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
    chargesheet: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
    trial: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100",
    convicted: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
    acquitted: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Case Explorer</h1>
        <p className="text-muted-foreground">Search and manage all cases in the system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and Filter Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by case number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground dark:bg-card dark:border-border"
                >
                  <option value="all">All Cases</option>
                  <option value="investigation">Investigation</option>
                  <option value="chargesheet">Chargesheet</option>
                  <option value="trial">Trial</option>
                  <option value="convicted">Convicted</option>
                  <option value="acquitted">Acquitted</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{filteredCases.length}</span> cases
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cases List and Detail View */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCase ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <CaseDetailView caseData={selectedCase} onBack={() => setSelectedCase(null)} />
            </motion.div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted rounded-lg animate-pulse dark:bg-muted" />
                  ))}
                </div>
              ) : filteredCases.length === 0 ? (
                <Card className="border-border bg-card dark:bg-card">
                  <CardContent className="pt-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No cases found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredCases.map((caseItem: Case, index: number) => (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <Card className="cursor-pointer border-border bg-card dark:bg-card hover:border-primary/50 transition-all hover:shadow-lg dark:hover:shadow-primary/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{caseItem.case_number}</h3>
                            <p className="text-sm text-muted-foreground">FIR: {caseItem.fir_number}</p>
                            <div className="flex gap-4 mt-3 text-sm">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                {caseItem.accused_count} accused
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(caseItem.investigation_start).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                statusColors[caseItem.status] ||
                                "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                              }`}
                            >
                              {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                            </span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CaseDetailView({
  caseData,
  onBack,
}: {
  caseData: Case
  onBack: () => void
}) {
  const { data: detailData, isLoading } = useSWR(
    `/api/cases/${caseData.id}`,
    () => apiService.getCaseDetail(caseData.id),
    { revalidateOnFocus: false },
  )

  const detail = detailData?.data || caseData

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-muted-foreground hover:text-foreground dark:hover:bg-muted"
      >
        Back to Cases
      </Button>

      <Card className="border-border bg-card dark:bg-card">
        <CardHeader className="border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-foreground">{detail.case_number}</CardTitle>
              <p className="text-muted-foreground mt-1">FIR: {detail.fir_number}</p>
            </div>
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium dark:bg-primary/20">
              {detail.status}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Accused Count</label>
                  <p className="text-lg font-semibold text-foreground mt-1">{detail.accused_count}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Investigation Start</label>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {new Date(detail.investigation_start).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Sections Charged</label>
                <div className="flex flex-wrap gap-2">
                  {detail.sections_charged?.map((section: string) => (
                    <span
                      key={section}
                      className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm dark:bg-accent/20"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary dark:hover:bg-primary/80">
                  View Full Details
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
