"use client";

import { useMemo, useState } from "react";
import {
  Line, // <-- CHANGED
  LineChart, // <-- CHANGED
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label, // <-- ADDED
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";
import {
  useGetTrends,
  useGetMetadataFields,
  TrendData,
  TrendsFilterParams,
} from "@/lib/api-services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

// --- FIX: Correct keys. Using non-grey colors. ---
const chartConfig = {
  Convicted: {
    label: "Convictions",
    color: "hsl(221.2 83.2% 53.3%)", // Vibrant Blue
  },
  Acquitted: {
    label: "Acquittals",
    color: "hsl(346.8 77.2% 49.8%)", // Vibrant Red
  },
} satisfies ChartConfig;

// --- Year and month filters ---
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Last 10 years
const months = [
  { value: 1, name: "Jan" },
  { value: 2, name: "Feb" },
  { value: 3, name: "Mar" },
  { value: 4, name: "Apr" },
  { value: 5, name: "May" },
  { value: 6, name: "Jun" },
  { value: 7, name: "Jul" },
  { value: 8, name: "Aug" },
  { value: 9, name: "Sep" },
  { value: 10, name: "Oct" },
  { value: 11, name: "Nov" },
  { value: 12, name: "Dec" },
];

export function TrendsChart() {
  const [filters, setFilters] = useState<TrendsFilterParams>({
    crime_type: null,
    year: null,
    month: null,
  });

  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  const { data, isLoading, isError, error } = useGetTrends(filters);
  const { data: metadata, isLoading: isLoadingMetadata } =
    useGetMetadataFields();

  // --- FIX: This is the corrected aggregation logic ---
  const chartData = useMemo(() => {
    if (!data) return [];

    if (period === "yearly") {
      const yearlyData = data.reduce((acc, month) => {
        // month.date is "Jan '23", so we parse it
        const year = "20" + month.date.split(" '")[1];

        if (!acc[year]) {
          acc[year] = {
            name: String(year),
            Convicted: 0,
            Acquitted: 0,
          };
        }
        acc[year].Convicted += month.Convicted;
        acc[year].Acquitted += month.Acquitted;
        return acc;
      }, {} as Record<string, { name: string; Convicted: number; Acquitted: number }>);

      return Object.values(yearlyData).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    // Default: return monthly data (it's already formatted)
    return data;
  }, [data, period]);

  // --- Handlers for filters ---
  const handleYearChange = (v: string) => {
    const newYear = v ? parseInt(v) : null;
    setFilters((f) => ({ ...f, year: newYear, month: null }));
  };

  const handleMonthChange = (v: string) => {
    setFilters((f) => ({ ...f, month: v ? parseInt(v) : null }));
  };

  const handleCrimeTypeChange = (v: string) => {
    setFilters((f) => ({ ...f, crime_type: v === "all" ? null : v }));
  };

  const handlePeriodChange = (value: "monthly" | "yearly") => {
    if (value) setPeriod(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle>Trends Over Time</CardTitle>
        {/* Filters are unchanged */}
        <div className="flex flex-col gap-2 md:flex-row">
          <Select
            value={filters.crime_type || "all"}
            onValueChange={handleCrimeTypeChange}
          >
            <SelectTrigger className="w-full md:w-[160px]">
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

          <Select
            value={filters.year?.toString() || "all"}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-full md:w-[110px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.month?.toString() || "all"}
            onValueChange={handleMonthChange}
            disabled={!filters.year}
          >
            <SelectTrigger className="w-full md:w-[110px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ToggleGroup
            type="single"
            value={period}
            onValueChange={handlePeriodChange}
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
        {isLoading && <Skeleton className="h-[350px] w-full" />}
        {isError && (
          <Alert variant="destructive" className="h-[350px]">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error?.message || "Failed to load trends data."}
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !isError && (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* --- 1. CHANGED to LineChart --- */}
              <LineChart
                data={chartData}
                margin={{
                  left: 12, // Increased left margin for Y-axis label
                  right: 12,
                  top: 10,
                  bottom: 20, // Increased bottom margin for X-axis label
                }}
              >
                <CartesianGrid vertical={false} />

                {/* --- 2. ADDED X-Axis Label --- */}
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  interval={period === "yearly" ? 0 : "auto"}
                  fontSize={12}
                >
                  <Label value="Time" position="insideBottom" offset={-15} />
                </XAxis>

                {/* --- 3. ADDED Y-Axis Label --- */}
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={9}
                  width={30}
                  fontSize={12}
                >
                  <Label
                    value="Total Cases"
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />

                {/* --- 4. REMOVED <defs> (not needed for Line) --- */}

                {/* --- 5. CHANGED Area to Line, added dots --- */}
                <Line
                  dataKey="Convicted"
                  type="monotone"
                  stroke="var(--color-Convicted)"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    fill: "var(--color-Convicted)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
                <Line
                  dataKey="Acquitted"
                  type="monotone"
                  stroke="var(--color-Acquitted)"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    fill: "var(--color-Acquitted)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
