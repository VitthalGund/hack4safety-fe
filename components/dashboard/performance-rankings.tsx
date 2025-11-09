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
import {
  AlertCircle,
  Loader2,
  Users,
  Building,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonnelScorecardModal from "@/components/dashboard/personnel-scorecard-modal";

type GroupBy = "Investigating_Officer" | "Police_Station" | "Term_Unit";

interface RankingData {
  rank: number;
  name: string;
  unit: string;
  totalCases: number;
  convictionRate: number;
}

const PAGE_LIMIT = 5;

const groupByOptions: Record<
  GroupBy,
  { label: string; icon: React.ElementType }
> = {
  Investigating_Officer: { label: "IO", icon: Users },
  Police_Station: { label: "Police Station", icon: Building },
  Term_Unit: { label: "Unit", icon: Shield },
};

// --- Hardcoded Odisha context data ---
const HARD_DATA: Record<string, RankingData[]> = {
  Investigating_Officer: [
    {
      rank: 1,
      name: "SI R. Patra",
      unit: "Bhubaneswar UPD",
      totalCases: 124,
      convictionRate: 92.5,
    },
    {
      rank: 2,
      name: "SI S. Pradhan",
      unit: "Cuttack UPD",
      totalCases: 110,
      convictionRate: 89.3,
    },
    {
      rank: 3,
      name: "ASI P. Behera",
      unit: "Rourkela",
      totalCases: 102,
      convictionRate: 88.7,
    },
    {
      rank: 4,
      name: "SI M. Das",
      unit: "Berhampur",
      totalCases: 98,
      convictionRate: 86.4,
    },
    {
      rank: 5,
      name: "SI T. Mohanty",
      unit: "Puri",
      totalCases: 95,
      convictionRate: 84.1,
    },
    {
      rank: 6,
      name: "ASI K. Nayak",
      unit: "Sambalpur",
      totalCases: 92,
      convictionRate: 82.9,
    },
    {
      rank: 7,
      name: "SI D. Barik",
      unit: "Balasore",
      totalCases: 88,
      convictionRate: 81.7,
    },
    {
      rank: 8,
      name: "SI P. Panda",
      unit: "Khurda",
      totalCases: 85,
      convictionRate: 80.2,
    },
    {
      rank: 9,
      name: "SI A. Jena",
      unit: "Kendrapara",
      totalCases: 82,
      convictionRate: 78.6,
    },
    {
      rank: 10,
      name: "ASI B. Mishra",
      unit: "Nayagarh",
      totalCases: 79,
      convictionRate: 76.9,
    },
  ],
  Term_Unit: [
    {
      rank: 1,
      name: "Economic Offences Wing",
      unit: "Odisha Police HQ",
      totalCases: 210,
      convictionRate: 93.4,
    },
    {
      rank: 2,
      name: "Crime Branch",
      unit: "Odisha Police HQ",
      totalCases: 185,
      convictionRate: 90.2,
    },
    {
      rank: 3,
      name: "Bhubaneswar UPD",
      unit: "Central Range",
      totalCases: 172,
      convictionRate: 88.1,
    },
    {
      rank: 4,
      name: "Cuttack UPD",
      unit: "Central Range",
      totalCases: 160,
      convictionRate: 86.9,
    },
    {
      rank: 5,
      name: "Rourkela Police District",
      unit: "Western Range",
      totalCases: 150,
      convictionRate: 85.7,
    },
    {
      rank: 6,
      name: "Berhampur Police District",
      unit: "Southern Range",
      totalCases: 142,
      convictionRate: 83.3,
    },
    {
      rank: 7,
      name: "Balasore Police District",
      unit: "Northern Range",
      totalCases: 136,
      convictionRate: 81.9,
    },
    {
      rank: 8,
      name: "Sambalpur Police District",
      unit: "Western Range",
      totalCases: 130,
      convictionRate: 80.5,
    },
    {
      rank: 9,
      name: "Puri Police District",
      unit: "Central Range",
      totalCases: 125,
      convictionRate: 79.8,
    },
    {
      rank: 10,
      name: "Kandhamal Police District",
      unit: "Southern Range",
      totalCases: 118,
      convictionRate: 78.6,
    },
  ],
  Police_Station: [
    {
      rank: 1,
      name: "Bhubaneswar UPD",
      unit: "Central Range",
      totalCases: 175,
      convictionRate: 89.3,
    },
    {
      rank: 2,
      name: "Cuttack UPD",
      unit: "Central Range",
      totalCases: 160,
      convictionRate: 86.5,
    },
    {
      rank: 3,
      name: "Rourkela",
      unit: "Western Range",
      totalCases: 145,
      convictionRate: 84.2,
    },
    {
      rank: 4,
      name: "Berhampur",
      unit: "Southern Range",
      totalCases: 138,
      convictionRate: 82.9,
    },
    {
      rank: 5,
      name: "Puri",
      unit: "Central Range",
      totalCases: 132,
      convictionRate: 81.5,
    },
    {
      rank: 6,
      name: "Sambalpur",
      unit: "Western Range",
      totalCases: 128,
      convictionRate: 80.3,
    },
    {
      rank: 7,
      name: "Balasore",
      unit: "Northern Range",
      totalCases: 122,
      convictionRate: 79.4,
    },
    {
      rank: 8,
      name: "Khurda",
      unit: "Central Range",
      totalCases: 118,
      convictionRate: 78.2,
    },
    {
      rank: 9,
      name: "Kendrapara",
      unit: "Northern Range",
      totalCases: 114,
      convictionRate: 77.3,
    },
    {
      rank: 10,
      name: "Nayagarh",
      unit: "Central Range",
      totalCases: 110,
      convictionRate: 76.0,
    },
  ],
};

export default function PerformanceRankings() {
  const [data, setData] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("Investigating_Officer");
  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        // if local data exists, use it
        if (HARD_DATA[groupBy]) {
          const paginated = HARD_DATA[groupBy].slice(skip, skip + PAGE_LIMIT);
          setData(paginated);
        } else {
          // else attempt to load from API
          const res = await fetch(`/api/v1/rankings?groupBy=${groupBy}`);
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          const apiData = await res.json();
          setData(apiData.slice(skip, skip + PAGE_LIMIT));
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data. Showing offline data if available.");
        const fallback = HARD_DATA["Investigating_Officer"] ?? [];
        setData(fallback.slice(0, PAGE_LIMIT));
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [groupBy, skip]);

  const handleNext = () => {
    const total = HARD_DATA[groupBy]?.length ?? 0;
    if (skip + PAGE_LIMIT < total) {
      setSkip(skip + PAGE_LIMIT);
    }
  };

  const handlePrev = () => {
    setSkip(Math.max(0, skip - PAGE_LIMIT));
  };

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
                    setSkip(0);
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
                {data.map((item) => (
                  <TableRow
                    key={item.name}
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
                disabled={
                  skip + PAGE_LIMIT >= (HARD_DATA[groupBy]?.length ?? 0) ||
                  loading
                }
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
