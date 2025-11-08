"use client";

import { useEffect, useState } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
// --- FIX: Import implemented function and new data type ---
import { fetchChargesheetComparison, SankeyData } from "@/lib/api-services";
import { AlertCircle, Loader2 } from "lucide-react";

// --- FIX: Interface definitions removed, now imported ---

export default function ChargesheetSankey() {
  // --- FIX: Use imported SankeyData type ---
  const [data, setData] = useState<SankeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchChargesheetComparison();
        setData(result);
      } catch (err) {
        console.error("Failed to load Sankey data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Chargesheet vs. Outcome
        </h2>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <div className="h-96">
            {data && (
              <ResponsiveSankey
                data={data} // Data is now { nodes: [], links: [] }
                margin={{ top: 20, right: 120, bottom: 20, left: 120 }}
                align="justify"
                colors={{ scheme: "category10" }}
                nodeOpacity={1}
                nodeThickness={18}
                nodeInnerPadding={3}
                nodeBorderWidth={0}
                nodeBorderColor={{
                  from: "color",
                  modifiers: [["darker", 0.8]],
                }}
                nodeSpacing={24}
                linkHoverOthersOpacity={0.1}
                enableLinkGradient={true}
                labelPosition="outside"
                labelOrientation="horizontal"
                labelPadding={16}
                labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
                theme={{
                  tooltip: {
                    container: {
                      background: "#1e293b",
                      color: "#f8fafc",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    },
                  },
                  labels: {
                    text: {
                      fill: "#64748b", // slate-500
                    },
                  },
                }}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    translateY: 36,
                    itemWidth: 100,
                    itemHeight: 14,
                    itemDirection: "left-to-right",
                    itemsSpacing: 12,
                    symbolSize: 14,
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000",
                        },
                      },
                    ],
                  },
                ]}
              />
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
