"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, LineChartIcon, PieChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService } from "@/lib/api-services";
import useSWR from "swr";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>("monthly");
  const [chargeType, setChargeType] = useState<string>("all");

  const { data: trendData, isLoading: trendsLoading } = useSWR(
    `/api/analytics/trends?period=${timeRange}`,
    () => apiService.getTrendAnalytics(timeRange),
    { revalidateOnFocus: false }
  );

  const { data: chargeData, isLoading: chargesLoading } = useSWR(
    `/api/analytics/chargesheet`,
    () => apiService.getChargesheetAnalytics(),
    { revalidateOnFocus: false }
  );

  return (
    <div className="space-y-8 p-3">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Analytics Hub</h1>
        <p className="text-muted-foreground">
          Advanced analytics and trend analysis
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card dark:bg-card border border-border rounded-lg p-0">
          <TabsTrigger value="trends">
            <LineChartIcon className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="chargesheet">
            <BarChart3 className="h-4 w-4 mr-2" />
            Chargesheet
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Distribution
          </TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {["weekly", "monthly", "yearly"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                onClick={() => setTimeRange(range)}
                className={`capitalize ${
                  timeRange === range
                    ? "bg-primary text-primary-foreground dark:bg-primary"
                    : "border-border dark:border-border"
                }`}
              >
                {range}
              </Button>
            ))}
          </div>

          {/* Conviction Trends */}
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle>Conviction Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {trendsLoading ? (
                <div className="h-64 bg-muted rounded-lg animate-pulse dark:bg-muted" />
              ) : (
                <div className="h-64 bg-muted/30 dark:bg-muted/20 rounded-lg flex items-center justify-center border border-border">
                  <p className="text-muted-foreground text-center">
                    Line chart showing conviction trends
                    <br />
                    <span className="text-xs">
                      (Nivo chart integration ready)
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Case Progression */}
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle>Case Progression by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { status: "Investigation", count: 245, percentage: 65 },
                  { status: "Chargesheet", count: 89, percentage: 45 },
                  { status: "Trial", count: 67, percentage: 32 },
                  { status: "Convicted", count: 43, percentage: 85 },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">
                        {item.status}
                      </label>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden dark:bg-muted">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: idx * 0.1 + 0.2, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chargesheet Tab */}
        <TabsContent value="chargesheet" className="space-y-6 mt-6">
          <div className="flex gap-2">
            {["all", "section", "outcome"].map((type) => (
              <Button
                key={type}
                variant={chargeType === type ? "default" : "outline"}
                onClick={() => setChargeType(type)}
                className={`capitalize ${
                  chargeType === type
                    ? "bg-primary text-primary-foreground dark:bg-primary"
                    : "border-border dark:border-border"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>

          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle>Chargesheet Comparison Flow</CardTitle>
            </CardHeader>
            <CardContent>
              {chargesLoading ? (
                <div className="h-64 bg-muted rounded-lg animate-pulse dark:bg-muted" />
              ) : (
                <div className="h-64 bg-muted/30 dark:bg-muted/20 rounded-lg flex items-center justify-center border border-border">
                  <p className="text-muted-foreground text-center">
                    Sankey diagram showing chargesheet flows
                    <br />
                    <span className="text-xs">
                      (Nivo sankey integration ready)
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chargesheet Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Chargesheet Filed", value: "1,234", change: "+12%" },
              { title: "Average Sections", value: "3.2", change: "-2%" },
              { title: "Filing Success Rate", value: "94%", change: "+8%" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-border bg-card dark:bg-card">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-end justify-between mt-2">
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border bg-card dark:bg-card">
              <CardHeader>
                <CardTitle>Conviction by Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 dark:bg-muted/20 rounded-lg flex items-center justify-center border border-border">
                  <p className="text-muted-foreground text-center text-sm">
                    Pie chart - Section distribution
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card dark:bg-card">
              <CardHeader>
                <CardTitle>Case Distribution by Court</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 dark:bg-muted/20 rounded-lg flex items-center justify-center border border-border">
                  <p className="text-muted-foreground text-center text-sm">
                    Doughnut chart - Court distribution
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution List */}
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle>Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Section 302 (Murder)", value: 342, pct: 28 },
                  {
                    label: "Section 304 (Culpable Homicide)",
                    value: 287,
                    pct: 23,
                  },
                  { label: "Section 376 (Rape)", value: 156, pct: 13 },
                  { label: "Section 392 (Dacoity)", value: 224, pct: 18 },
                  { label: "Others", value: 181, pct: 18 },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.value} cases
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden dark:bg-muted">
                        <div
                          className="h-full bg-indigo-500 dark:bg-indigo-600"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground w-10 text-right">
                        {item.pct}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
