"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchPerformanceRankings, RankingData } from "@/lib/api-services";
import {
  AlertCircle,
  Loader2,
  Users,
  Building,
  ChevronLeft,
  ChevronRight,
  Shield, // <-- Added icon for Units
} from "lucide-react";
import PersonnelScorecardModal from "@/components/dashboard/personnel-scorecard-modal";
import { Button } from "@/components/ui/button";

// --- 1. Add "Term_Unit" to type ---
type GroupBy = "Investigating_Officer" | "Police_Station" | "Term_Unit";
const PAGE_LIMIT = 5;

// --- 2. Add helper map for display ---
const groupByOptions: Record<
  GroupBy,
  { label: string; icon: React.ElementType }
> = {
  Investigating_Officer: { label: "IO", icon: Users },
  Police_Station: { label: "Police Station", icon: Building },
  Term_Unit: { label: "Unit", icon: Shield },
};

export default function PerformanceRankings() {
  const [data, setData] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("Investigating_Officer");

  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchPerformanceRankings(
          groupBy,
          skip,
          PAGE_LIMIT
        );
        setData(result);
      } catch (err) {
        console.error("Failed to load performance rankings:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [groupBy, skip]);

  const handleNext = () => {
    if (data.length === PAGE_LIMIT) {
      setSkip(skip + PAGE_LIMIT);
    }
  };

  const handlePrev = () => {
    setSkip(Math.max(0, skip - PAGE_LIMIT));
  };

  const chartData = data;
  const isOfficer = groupBy === "Investigating_Officer";

  if (error) {
    return (
      <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Top Performers
          </h2>
          {/* --- 3. Use Button component and map --- */}
          <div className="flex gap-2">
            {(Object.keys(groupByOptions) as GroupBy[]).map((opt) => {
              const Icon = groupByOptions[opt].icon;
              return (
                <Button
                  key={opt}
                  variant={groupBy === opt ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => {
                    setGroupBy(opt);
                    setSkip(0); // Reset pagination on filter change
                  }}
                  disabled={loading}
                  className="flex gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {groupByOptions[opt].label}
                </Button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit / Rank</TableHead>
                  <TableHead>Total Cases</TableHead>
                  <TableHead>Conviction Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((item) => (
                  <TableRow
                    key={item.name}
                    // --- 4. Ensure only officer rows are clickable ---
                    className={
                      isOfficer
                        ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                        : ""
                    }
                    onClick={() => {
                      if (isOfficer) {
                        setSelectedOfficer(item.name);
                      }
                    }}
                  >
                    <TableCell className="font-medium">{item.rank}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.totalCases}</TableCell>
                    <TableCell className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.convictionRate.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 flex items-center justify-end gap-2 border-t dark:border-slate-700">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={skip === 0 || loading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={data.length < PAGE_LIMIT || loading}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </Card>

      <PersonnelScorecardModal
        officerName={selectedOfficer}
        isOpen={!!selectedOfficer}
        onClose={() => setSelectedOfficer(null)}
      />
    </motion.div>
  );
}
