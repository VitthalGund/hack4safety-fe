"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import KpiCards from "@/components/dashboard/kpi-cards";
import ConvictionRateChart from "@/components/dashboard/conviction-rate-chart";
import PerformanceRankings from "@/components/dashboard/performance-rankings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetCases,
  useGetMetadataFields,
  useGetTrends,
} from "@/lib/api-services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendsChart } from "@/components/dashboard/trends-chart";

// --- Import the new components ---
import CaseExplorer from "@/components/dashboard/case-explorer";
import AcquittalRateChart from "@/components/dashboard/acquittal-rate-chart";
import ChargesheetSankey from "@/components/dashboard/chargesheet-sankey";
import CaseList from "@/components/dashboard/case-list";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [crimeTypeFilter, setCrimeTypeFilter] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<"monthly" | "yearly">("monthly");

  // Fetch data for cases list
  const { data: cases, isLoading: isLoadingCases } = useGetCases(
    "",
    user?.district ? { district: user.district } : {}
  );

  // Fetch data for new trends chart
  const { data: trendsData, isLoading: isLoadingTrends } =
    useGetTrends(crimeTypeFilter);

  // Fetch data for filter dropdowns
  const { data: metadata, isLoading: isLoadingMetadata } =
    useGetMetadataFields();

  return (
    <div className="flex flex-col gap-6 p-4">
      <KpiCards />

      {/* --- MODIFIED: Changed grid to single column --- */}
      <div className="grid grid-cols-1 gap-6">
        <ConvictionRateChart />

        <Card>
          <CardContent>
            {/* --- PASS NEW PROP TO CHART --- */}
            <TrendsChart
              data={trendsData}
              isLoading={isLoadingTrends}
              period={timePeriod}
            />
          </CardContent>
        </Card>
      </div>
      {/* --- END OF MODIFICATION --- */}

      <div className="flex flex-col gap-6">
        <div className="">
          <PerformanceRankings />
        </div>
        <div className="mb-8">
          <ChargesheetSankey />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <CaseList
              cases={cases?.slice(0, 5) || []}
              isLoading={isLoadingCases}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
