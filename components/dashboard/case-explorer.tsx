// components/dashboard/case-explorer.tsx

"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useGetCases,
  CaseFilterParams,
  Case,
} from "@/lib/api-services";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import CaseDetailModal from "./case-detail-modal";
import { useAuthStore } from "@/lib/auth-store";

// --- Pagination Limit ---
const LIMIT = 5; // Show 5 cases per page

export default function CaseExplorer() {
  const { user } = useAuthStore();
  const [skip, setSkip] = useState(0);

  // Set default filter to user's district if it exists
  const [filters, setFilters] = useState<CaseFilterParams>(
    user?.district ? { district: user.district } : {}
  );
  const [search, setSearch] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // This hook fetches paginated data
  const {
    data: cases,
    isLoading,
    isError,
    error,
  }_ = useGetCases(search, filters, skip, LIMIT);

  const handleNext = () => {
    if (cases && cases.length === LIMIT) {
      setSkip(skip + LIMIT);
    }
  };

  const handlePrev = () => {
    setSkip(Math.max(0, skip - LIMIT));
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Case Explorer</CardTitle>
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={skip === 0 || isLoading}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!cases || cases.length < LIMIT || isLoading}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          )}
          {isError && (
            <Alert variant="destructive" className="h-60">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error?.message || "Failed to load cases."}
              </AlertDescription>
            </Alert>
          )}
          {!isLoading && !isError && cases && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Accused</TableHead>
                  <TableHead>IO</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No cases found.
                    </TableCell>
                  </TableRow>
                )}
                {cases.map((item) => (
                  <TableRow
                    key={item._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedCaseId(item._id)}
                  >
                    <TableCell className="font-medium">
                      {item.Case_Number}
                      <div className="text-xs text-muted-foreground">
                        {item.Police_Station}
                      </div>
                    </TableCell>
                    <TableCell>{item.Accused_Name}</TableCell>
                    <TableCell>{item.Investigating_Officer}</TableCell>
                    <TableCell>{item.Sections_at_Final}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.Result === "Convicted"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          item.Result === "Convicted"
                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                        }
                      >
                        {item.Result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CaseDetailModal
        caseId={selectedCaseId}
        isOpen={!!selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
      />
    </>
  );
}