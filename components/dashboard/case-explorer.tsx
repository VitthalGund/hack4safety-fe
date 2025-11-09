"use client";

import { useState } from "react";
import {
  Card,
  Title,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Text,
  Badge,
  BadgeProps,
} from "@tremor/react";
import { useGetCases, CaseFilterParams, Case } from "@/lib/api-services";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import CaseDetailModal from "./case-detail-modal";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

// Define badge colors
const resultColorMap: { [key: string]: BadgeProps["color"] } = {
  Convicted: "emerald",
  Acquitted: "rose",
};

// Set pagination limit
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
  } = useGetCases(search, filters, skip, LIMIT);

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
      <Card className="h-full flex flex-col dark:border-slate-700">
        <Title className="dark:text-white p-6">Case Explorer</Title>

        {isLoading && (
          <div className="flex-grow flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        )}

        {isError && (
          <div className="flex-grow flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6 mr-2" />
            <Text color="red">Error: {error?.message}</Text>
          </div>
        )}

        {!isLoading && !isError && cases && (
          <>
            <Table className="px-6">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Case Number</TableHeaderCell>
                  <TableHeaderCell>Accused Name</TableHeaderCell>
                  <TableHeaderCell>Investigating Officer</TableHeaderCell>
                  <TableHeaderCell>Sections</TableHeaderCell>
                  <TableHeaderCell>Result</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <Text>No cases found.</Text>
                    </TableCell>
                  </TableRow>
                )}
                {cases.map((item) => (
                  <TableRow
                    key={item._id}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => setSelectedCaseId(item._id)}
                  >
                    <TableCell>
                      <Text className="dark:text-white font-medium">
                        {item.Case_Number}
                      </Text>
                      <Text className="dark:text-slate-400">
                        {item.Police_Station}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text className="dark:text-white">
                        {item.Accused_Name}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text className="dark:text-white">
                        {item.Investigating_Officer}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text className="dark:text-white">
                        {item.Sections_at_Final}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={resultColorMap[item.Result] || "gray"}
                        className="capitalize"
                      >
                        {item.Result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="mt-auto p-4 flex items-center justify-end gap-2 border-t dark:border-slate-700">
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
    </>
  );
}
