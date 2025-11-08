"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { fetchConvictionRate } from "@/lib/api-services";
import { AlertCircle, Loader2 } from "lucide-react";

interface ConvictionData {
  name: string;
  total: number;
  convicted: number;
  acquitted: number;
  rate: number;
}

type GroupBy = "District" | "Court_Name" | "Crime_Type";

export default function ConvictionRateChart() {
  const [data, setData] = useState<ConvictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("District");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const result = await fetchConvictionRate(groupBy);
        setData(result);
      } catch (err) {
        console.error("Failed to load conviction rate data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [groupBy]); // Re-run when groupBy changes

  // --- FIX: Data is now pre-formatted, no .map() needed ---
  const chartData = data;

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
      <Card className="p-6 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Conviction Rate
          </h2>
          <div className="flex gap-2">
            {(["District", "Court_Name", "Crime_Type"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setGroupBy(opt)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  groupBy === opt
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                }`}
              >
                {opt.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                className="dark:stroke-slate-700"
              />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "#64748b" }}
                domain={[0, 100]}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(1)}%`,
                  "Conviction Rate",
                ]}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
              />
              <Legend />
              <Bar
                dataKey="ConvictionRate"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}
