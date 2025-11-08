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
import { fetchTrends, TrendData } from "@/lib/api-services";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- FIX: Create lists for filters ---
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // [2025, 2024, ...]
const months = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

export default function TrendsChart() {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  // --- FIX: Default to last 2 years (e.g., 2024) ---
  const [selectedYear, setSelectedYear] = useState<number | null>(
    currentYear - 1
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        setLoading(true);
        setError(null);

        let yearToFetch = selectedYear;
        let monthToFetch = selectedMonth;

        // Logic for "Yearly" toggle
        if (period === "yearly") {
          yearToFetch = null; // Yearly shows all years
          monthToFetch = null;
          if (selectedYear || selectedMonth) {
            setSelectedYear(null); // Reset filters if user clicks "Yearly"
            setSelectedMonth(null);
          }
        }

        const result = await fetchTrends(period, yearToFetch, monthToFetch);
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
  }, [period, selectedYear, selectedMonth]); // Re-run when any filter changes

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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Trends Over Time
          </h2>

          <div className="flex gap-2">
            {/* --- FIX: Add Year Filter Select --- */}
            <Select
              value={selectedYear?.toString() ?? "all"}
              onValueChange={(value) => {
                const newYear = value === "all" ? null : Number(value);
                setSelectedYear(newYear);
                if (newYear) setPeriod("monthly"); // Force monthly if year is set
                if (!newYear) setSelectedMonth(null); // Clear month if "All Years"
              }}
              disabled={loading || period === "yearly"}
            >
              <SelectTrigger className="w-[120px] bg-slate-200 dark:bg-slate-700">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* --- FIX: Add Month Filter Select --- */}
            <Select
              value={selectedMonth?.toString() ?? "all"}
              onValueChange={(value) => {
                setSelectedMonth(value === "all" ? null : Number(value));
              }}
              disabled={loading || !selectedYear} // Disabled if no year is selected
            >
              <SelectTrigger className="w-[120px] bg-slate-200 dark:bg-slate-700">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setPeriod("yearly")}
              disabled={loading || !!selectedYear} // Disable if a year is selected
              className={`px-4 py-2 rounded-lg transition-colors capitalize text-sm ${
                period === "yearly"
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
              }`}
              title={
                selectedYear
                  ? "Yearly view is disabled when a year is selected"
                  : ""
              }
            >
              Yearly
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
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
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}
