"use client";

import { useState } from "react";
import { Card, Title, BarChart, Select, SelectItem, Text } from "@tremor/react";
import { useGetAcquittalRate } from "@/lib/api-services";
import { Loader2, AlertCircle } from "lucide-react";

type GroupBy = "District" | "Court_Name" | "Crime_Type" | "Sections_of_Law";

export default function AcquittalRateChart() {
  const [groupBy, setGroupBy] = useState<string>("District");

  const { data, isLoading, isError, error } = useGetAcquittalRate(groupBy);

  const chartData = data || [];

  return (
    <Card className="h-full bg-white dark:border-slate-700 p-6">
      <div className="flex justify-between items-center">
        <Title className="dark:text-white">
          Acquittal Rate by {groupBy.replace("_", " ")}
        </Title>
        <Select
          value={groupBy}
          onValueChange={setGroupBy}
          className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        >
          <SelectItem value="District">District</SelectItem>
          <SelectItem value="Court_Name">Court</SelectItem>
          <SelectItem value="Crime_Type">Crime Type</SelectItem>
          <SelectItem value="Sections_of_Law">Sections</SelectItem>
        </Select>
      </div>

      {isLoading && (
        <div className="h-72 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-600 dark:text-rose-400" />
        </div>
      )}

      {isError && (
        <div className="h-72 flex items-center justify-center text-red-600 dark:text-red-400">
          <AlertCircle className="w-6 h-6 mr-2" />
          <Text color="red">Error: {error.message}</Text>
        </div>
      )}

      {!isLoading && !isError && (
        <BarChart
          className="mt-6 h-72"
          data={chartData}
          index="name"
          categories={["AcquittalRate"]}
          colors={["rose"]}
          yAxisWidth={40}
          valueFormatter={(value) => `${value}%`}
        />
      )}
    </Card>
  );
}
