"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import KpiCards from "@/components/dashboard/kpi-cards";
import ConvictionRateChart from "@/components/dashboard/conviction-rate-chart";
import PerformanceRankings from "@/components/dashboard/performance-rankings";
import CaseList from "@/components/dashboard/case-list";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Trends Over Time</CardTitle>
            <div className="flex flex-col gap-2 md:flex-row">
              {/* --- CRIME TYPE FILTER --- */}
              <Select
                value={crimeTypeFilter}
                onValueChange={(value) =>
                  setCrimeTypeFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Crime Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crime Types</SelectItem>
                  {isLoadingMetadata ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    metadata?.Crime_Type?.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* --- MONTHLY/YEARLY TOGGLE --- */}
              <ToggleGroup
                type="single"
                value={timePeriod}
                onValueChange={(value) => {
                  if (value) setTimePeriod(value as "monthly" | "yearly");
                }}
                className="w-full md:w-auto"
              >
                <ToggleGroupItem value="monthly" className="w-full">
                  Monthly
                </ToggleGroupItem>
                <ToggleGroupItem value="yearly" className="w-full">
                  Yearly
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardHeader>
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
