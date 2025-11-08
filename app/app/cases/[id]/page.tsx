"use client"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Share2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiService } from "@/lib/api-services"
import useSWR from "swr"
import { useRouter, useParams } from "next/navigation"

export default function CaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const caseId = params.id as string

  const {
    data: caseDetail,
    isLoading,
    error,
  } = useSWR(`/api/cases/${caseId}`, () => apiService.getCaseDetail(caseId), { revalidateOnFocus: false })

  const detail = caseDetail?.data

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded-lg animate-pulse w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <Card className="border-destructive/50 bg-destructive/10 dark:bg-destructive/10">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Error Loading Case</h3>
              <p className="text-sm text-muted-foreground mt-1">Unable to load case details. Please try again.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{detail.case_number}</h1>
          <p className="text-muted-foreground mt-1">FIR: {detail.fir_number}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border dark:border-border bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="border-border dark:border-border bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card dark:bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-2xl font-bold text-foreground mt-2 capitalize">{detail.status}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card dark:bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Accused</p>
            <p className="text-2xl font-bold text-foreground mt-2">{detail.accused_count}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card dark:bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Sections</p>
            <p className="text-2xl font-bold text-foreground mt-2">{detail.sections_charged?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card dark:bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-lg font-bold text-foreground mt-2">{new Date(detail.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card dark:bg-card border border-border rounded-lg p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accused">Accused</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Investigation Start</label>
                  <p className="text-foreground mt-1">{new Date(detail.investigation_start).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Section IPC</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {detail.sections_charged?.map((section: string) => (
                      <span
                        key={section}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs dark:bg-primary/20"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accused" className="space-y-4">
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle>Accused Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Total accused: {detail.accused_count}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle>Case Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Timeline view coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
