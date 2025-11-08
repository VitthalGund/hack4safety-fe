"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { fetchCaseDetails, fetchCaseSummary } from "@/lib/api-services";

interface Case {
  _id: string;
  Case_Number: string;
  Police_Station: string;
  District: string;
  Investigating_Officer: string;
  Accused_Name: string;
  Sections_of_Law: string;
  Result: string;
}

interface CaseDetailModalProps {
  caseId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className="py-2 border-b border-slate-200 dark:border-slate-700">
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {label}
    </p>
    <p className="text-md text-slate-900 dark:text-white">{value || "N/A"}</p>
  </div>
);

export default function CaseDetailModal({
  caseId,
  isOpen,
  onClose,
}: CaseDetailModalProps) {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && caseId) {
      const loadData = async () => {
        try {
          setLoading(true);
          setError(null);
          setCaseData(null);
          setSummary(null);

          // Fetch details and summary in parallel
          const data = await fetchCaseDetails(caseId);
          setCaseData(data);

          const summaryText = await fetchCaseSummary(data); // Mocked AI summary
          setSummary(summaryText);
        } catch (err) {
          console.error("Failed to load case details:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load details"
          );
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, caseId]);

  const handleClose = () => {
    if (loading) return; // Don't close while loading
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Case Details</DialogTitle>
          {caseData && (
            <DialogDescription>{caseData.Case_Number}</DialogDescription>
          )}
        </DialogHeader>

        {loading && (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && caseData && (
          <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* AI Summary Section */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 flex items-center mb-2">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Summary
              </h3>
              {summary ? (
                <div
                  className="prose prose-sm dark:prose-invert prose-p:my-1 prose-ul:my-2"
                  dangerouslySetInnerHTML={{ __html: summary }}
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating summary...</span>
                </div>
              )}
            </div>

            {/* Full Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
                Full Case Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <DetailRow label="Case Number" value={caseData.Case_Number} />
                <DetailRow label="Result" value={caseData.Result} />
                <DetailRow label="District" value={caseData.District} />
                <DetailRow
                  label="Police Station"
                  value={caseData.Police_Station}
                />
                <DetailRow label="Accused Name" value={caseData.Accused_Name} />
                <DetailRow
                  label="Sections of Law"
                  value={caseData.Sections_of_Law}
                />
                <DetailRow label="Court Name" value={caseData.Court_Name} />
                <DetailRow
                  label="Investigating Officer"
                  value={caseData.Investigating_Officer}
                />
                <DetailRow
                  label="Date of Registration"
                  value={caseData.Date_of_Registration}
                />
                <DetailRow
                  label="Date of Chargesheet"
                  value={caseData.Date_of_Chargesheet}
                />
                <DetailRow
                  label="Date of Judgement"
                  value={caseData.Date_of_Judgement}
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
