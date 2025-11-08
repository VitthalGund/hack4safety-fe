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
import { AlertCircle, Loader2, Star, Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  fetchPersonnelScorecard,
  PersonnelScorecard,
} from "@/lib/api-services";

interface PersonnelScorecardModalProps {
  officerName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon: React.ElementType;
}) => {
  const Icon = icon;
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
        {value}
      </p>
    </div>
  );
};

export default function PersonnelScorecardModal({
  officerName,
  isOpen,
  onClose,
}: PersonnelScorecardModalProps) {
  const [scorecard, setScorecard] = useState<PersonnelScorecard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && officerName) {
      const loadData = async () => {
        try {
          setLoading(true);
          setError(null);
          setScorecard(null);
          const data = await fetchPersonnelScorecard(officerName);
          setScorecard(data);
        } catch (err) {
          console.error("Failed to load scorecard:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load scorecard"
          );
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, officerName]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Officer Scorecard</DialogTitle>
          {scorecard && (
            <DialogDescription>
              {scorecard.officer_name} - {scorecard.rank}
            </DialogDescription>
          )}
        </DialogHeader>

        {loading && (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && scorecard && (
          <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Conviction Rate"
                value={`${(scorecard.conviction_rate * 100).toFixed(1)}%`}
                icon={Star}
              />
              <StatCard
                label="Total Cases"
                value={scorecard.total_cases}
                icon={Check}
              />
              <StatCard
                label="Total Acquittals"
                value={scorecard.total_acquittals}
                icon={X}
              />
              <StatCard
                label="Avg. Inv. Days"
                value={scorecard.avg_investigation_duration_days}
                icon={Clock}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Common Acquittal Reasons
              </h3>
              <div className="flex flex-wrap gap-2">
                {scorecard.common_acquittal_reasons.length > 0 ? (
                  scorecard.common_acquittal_reasons.map((reason, index) => (
                    <Badge key={index} variant="secondary">
                      {reason}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No acquittals recorded.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Recent Cases
              </h3>
              <div className="space-y-2">
                {scorecard.recent_cases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
                      {caseItem.Case_Number}
                    </p>
                    <Badge
                      variant={
                        caseItem.Result === "Conviction"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        caseItem.Result === "Conviction"
                          ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      }
                    >
                      {caseItem.Result}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
