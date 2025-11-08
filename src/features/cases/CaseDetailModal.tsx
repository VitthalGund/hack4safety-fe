"use client"
import { useCaseDetail } from "@/api/apiHooks"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { X } from "lucide-react"
import { useState } from "react"

interface CaseDetailModalProps {
  caseId: string
  onClose: () => void
}

export const CaseDetailModal = ({ caseId, onClose }: CaseDetailModalProps) => {
  const { data: caseDetail, isLoading } = useCaseDetail(caseId)
  const [activeTab, setActiveTab] = useState<"summary" | "timeline" | "documents">("summary")

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <LoadingSpinner message="Loading case details..." />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div>
            <h2 className="text-xl font-bold text-foreground">{caseDetail?.caseId}</h2>
            <p className="text-sm text-muted-foreground mt-1">{caseDetail?.accusedName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/20">
          {["summary", "timeline", "documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === "summary" && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Case ID</p>
                <p className="font-mono text-foreground">{caseDetail?.caseId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Status</p>
                <p className="text-foreground">{caseDetail?.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Section of Law</p>
                <p className="text-foreground">{caseDetail?.section}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Court</p>
                <p className="text-foreground">{caseDetail?.court}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Judge</p>
                <p className="text-foreground">{caseDetail?.judge}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Accused</p>
                <p className="text-foreground">{caseDetail?.accusedName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground font-semibold mb-1">Summary</p>
                <p className="text-foreground text-sm">{caseDetail?.summary}</p>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              {caseDetail?.timeline?.map((event: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-2">
              {caseDetail?.documents?.map((doc: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <span className="text-foreground text-sm">{doc.name}</span>
                  <a href={doc.url} className="text-primary text-xs hover:underline">
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
