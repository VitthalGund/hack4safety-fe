"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";
import { TrendData } from "@/lib/api-services";

type TrendsChartProps = {
  data: TrendData[] | undefined;
  isLoading: boolean;
  period: "monthly" | "yearly";
};

// --- MODIFIED: Updated chart config for Area chart ---
const chartConfig = {
  total_convictions: {
    label: "Convictions",
    color: "hsl(var(--chart-2))",
  },
  total_acquittals: {
    label: "Acquittals",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TrendsChart({ data, isLoading, period }: TrendsChartProps) {
  // useMemo logic remains the same, it is correct
  const chartData = useMemo(() => {
    if (!data) return [];

    if (period === "yearly") {
      // Aggregate data by year
      const yearlyData = data.reduce((acc, month) => {
        const year = month.year;
        if (!acc[year]) {
          acc[year] = {
            name: String(year),
            total_convictions: 0,
            total_acquittals: 0,
          };
        }
        acc[year].total_convictions += month.total_convictions;
        acc[year].total_acquittals += month.total_acquittals;
        return acc;
      }, {} as Record<string, { name: string; total_convictions: number; total_acquittals: number }>);
      return Object.values(yearlyData);
    }

    // Default: Format for monthly
    return data.map((month) => ({
      name: `${month.year}-${String(month.month).padStart(2, "0")}`,
      total_convictions: month.total_convictions,
      total_acquittals: month.total_acquittals,
    }));
  }, [data, period]);

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {/* --- MODIFIED: Swapped BarChart for AreaChart --- */}
        <AreaChart
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            interval={period === "yearly" ? 0 : "auto"}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} width={30} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <defs>
            <linearGradient id="fillConvictions" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-total_convictions)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-total_convictions)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillAcquittals" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-total_acquittals)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-total_acquittals)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="total_convictions"
            type="monotone"
            fill="url(#fillConvictions)"
            stroke="var(--color-total_convictions)"
            stackId="1"
          />
          <Area
            dataKey="total_acquittals"
            type="monotone"
            fill="url(#fillAcquittals)"
            stroke="var(--color-total_acquittals)"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
