"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users, FileText, Clock, Gavel } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
// --- FIX: Import implemented function and new data type ---
import { fetchKPIs, KPIData } from "@/lib/api-services";

// --- FIX: Interface removed, now imported ---

const KPICard = ({
  icon: Icon,
  title,
  value,
  unit,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  unit: string;
  color: string;
}) => (
  <Card className="p-6 dark:border-slate-700">
    <motion.div
      className="flex items-center justify-between"
      whileHover={{ scale: 1.03 }}
    >
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
          {title}
        </p>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            {unit}
          </p>
        </div>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </motion.div>
  </Card>
);

const KPISkeleton = () => (
  <Card className="p-6 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="w-12 h-12 rounded-lg" />
    </div>
  </Card>
);

export default function KPICards() {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchKPIs(); // This now calls the real API
        setData(result);
      } catch (err) {
        console.error("Failed to load KPIs:", err);
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // --- FIX: Add loading and error state handling ---
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-6 col-span-full border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
        <p className="text-sm text-red-600 dark:text-red-400">
          Error loading KPI data.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Cases"
        value={data.totalCases}
        unit="records"
        icon={FileText}
        color="bg-indigo-500"
      />
      <KPICard
        title="Avg. Case Lifecycle"
        value={data.avgLifecycleDays.toFixed(1)}
        unit="days"
        icon={Clock}
        color="bg-emerald-500"
      />
      <KPICard
        title="Avg. Investigation"
        value={data.avgInvestigationDays.toFixed(1)}
        unit="days"
        icon={Users}
        color="bg-amber-500"
      />
      <KPICard
        title="Avg. Trial Duration"
        value={data.avgTrialDays.toFixed(1)}
        unit="days"
        icon={Gavel}
        color="bg-red-500"
      />
    </div>
  );
}
