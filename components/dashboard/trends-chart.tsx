"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
// --- FIX: Import new data type and implemented function ---
import { fetchTrends, TrendData } from "@/lib/api-services";
import { AlertCircle, Loader2 } from "lucide-react";

// --- FIX: Interface removed, now imported from api-services ---

export default function TrendsChart() {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const loadTrends = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const result = await fetchTrends(period);
        setData(result);
      } catch (err) {
        console.error("Failed to load trends:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load trends data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrends();
  }, [period]); // Re-run when 'period' changes

  // --- FIX: Data is now pre-formatted by fetchTrends, no .map() needed ---
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
            Trends Over Time
          </h2>
          <div className="flex gap-2">
            {(["monthly", "yearly"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setPeriod(opt)}
                disabled={loading} // Disable while loading
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  period === opt
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                }`}
              >
                {opt}
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
            {/* --- FIX: Removed yAxisId="right" as we removed the second axis --- */}
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                className="dark:stroke-slate-700"
              />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Convicted"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981" }}
              />
              <Line
                type="monotone"
                dataKey="Acquitted"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b" }}
              />
              {/* --- FIX: Removed line for "Avg Duration" as API doesn't provide it --- */}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}
