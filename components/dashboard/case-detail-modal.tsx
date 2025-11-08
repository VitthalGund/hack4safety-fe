"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { fetchCaseDetails } from "@/lib/api-services";

interface Case {
  _id: string;
  Case_Number: string;
  Police_Station: string;
  District: string;
  Investigating_Officer: string;
  Rank: string;
  Accused_Name: string;
  Sections_of_Law: string;
  Crime_Type: string;
  Court_Name: string;
  Date_of_Registration: string;
  Date_of_Chargesheet: string;
  Date_of_Judgement: string;
  Duration_of_Trial_days: number;
  Result: "Conviction" | "Acquitted" | string;
  Nature_of_Offence: string;
  Summary: string;
}

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string | null;
}

export default function CaseDetailModal({
  isOpen,
  onClose,
  caseId,
}: CaseDetailModalProps) {
  const [caseDetails, setCaseDetails] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && caseId) {
      const loadDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          setCaseDetails(null);
          const response = await fetchCaseDetails(caseId);
          setCaseDetails(response);
        } catch (err) {
          console.error("Failed to load case details:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load details"
          );
        } finally {
          setLoading(false);
        }
      };
      loadDetails();
    }
  }, [isOpen, caseId]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-5xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Case Details: {caseDetails?.Case_Number ?? "Loading..."}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-6">
          {loading && !error && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {caseDetails && !loading && !error && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Accused</label>
                  <p className="font-medium">{caseDetails.Accused_Name}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Result</label>
                  <p className="font-medium">{caseDetails.Result}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Sections</label>
                  <p className="font-medium">{caseDetails.Sections_of_Law}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">
                    Investigating Officer
                  </label>
                  <p className="font-medium">
                    {caseDetails.Investigating_Officer} ({caseDetails.Rank})
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">
                    Police Station
                  </label>
                  <p className="font-medium">{caseDetails.Police_Station}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">District</label>
                  <p className="font-medium">{caseDetails.District}</p>
                </div>
              </div>

              {/* AI Summary */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                  Summary
                </h4>
                <div className="prose prose-sm dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  {/* --- FIX: Directly use the Summary field from caseDetails --- */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: caseDetails.Summary ?? "No summary available.",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
