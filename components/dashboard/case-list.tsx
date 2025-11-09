// components/dashboard/case-list.tsx

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
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
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import CaseDetailModal from "@/components/dashboard/case-detail-modal";
// --- FIX: Import hooks and types from api-services ---
import { useGetCases, Case, CaseFilterParams } from "@/lib/api-services";
import { useAuthStore } from "@/lib/auth-store";
import { useDebounce } from "@/hooks/use-debounce"; // Assumes hooks/use-debounce.ts exists

const LIMIT = 5; // Cases per page

export default function CaseList() {
  const { user } = useAuthStore();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // --- FIX: State for search, pagination, and filters ---
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [skip, setSkip] = useState(0);
  const [filters, setFilters] = useState<CaseFilterParams>(
    user?.district ? { district: user.district } : {}
  );

  // --- FIX: Use hook for data fetching ---
  const {
    data: cases,
    isLoading,
    isError,
    error,
  } = useGetCases(debouncedSearch, filters, skip, LIMIT);

  const handleNext = () => {
    if (cases && cases.length === LIMIT) {
      setSkip(skip + LIMIT);
    }
  };

  const handlePrev = () => {
    setSkip(Math.max(0, skip - LIMIT));
  };

  if (isError) {
    return (
      <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">
            {error?.message || "Failed to load cases"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="dark:border-slate-700">
        <div className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-grow sm:flex-grow-0 sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by case, accused..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* --- FIX: Removed "View All" button --- */}
        </div>

        {isLoading && !cases ? ( // Show loader only on initial load
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <>
            <Table className="p-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Accused</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases && cases.length > 0 ? (
                  cases.map((item) => (
                    <TableRow
                      key={item._id}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => setSelectedCaseId(item._id)}
                    >
                      <TableCell className="font-medium">
                        {item.Case_Number}
                      </TableCell>
                      <TableCell>{item.Accused_Name}</TableCell>
                      <TableCell>{item.Sections_at_Final}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            // --- FIX: Check for "Convicted" ---
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No cases found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* --- FEATURE: Pagination Controls --- */}
            <div className="p-4 flex items-center justify-end gap-2 border-t dark:border-slate-700">
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
          </>
        )}
      </Card>

      <CaseDetailModal
        caseId={selectedCaseId}
        isOpen={!!selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
      />
    </motion.div>
  );
}
