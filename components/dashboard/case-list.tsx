"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Loader2, Search } from "lucide-react"; // <-- Import Search
import { Input } from "@/components/ui/input"; // <-- Import Input

// --- FIX: Import the new modal component ---
import CaseDetailModal from "@/components/dashboard/case-detail-modal";
import apiClient from "@/lib/api-client";

interface Case {
  _id: string;
  Case_Number: string;
  Police_Station: string;
  District: string;
  Investigating_Officer: string;
  Accused_Name: string;
  Sections_of_Law: string;
  Result: string;
}

export default function CaseList() {
  const [data, setData] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // --- FIX: Add state for search term ---
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // --- FIX: Call the real /cases/search endpoint ---
        const response = await apiClient.get<Case[]>("/cases/search", {
          params: {
            limit: 5,
            // --- FIX: Pass search term to backend query param ---
            accused_name: searchTerm || undefined,
          },
        });
        setData(response.data);
      } catch (err) {
        console.error("Failed to load recent cases:", err);
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    // --- FIX: Debounce search input ---
    const timer = setTimeout(() => {
      loadData();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer); // Clear the timer if user types again
  }, [searchTerm]); // Re-run effect when searchTerm changes

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
      <Card className="dark:border-slate-700">
        <div className="p-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Recent Cases
          </h2>

          {/* --- FIX: Add Search Bar --- */}
          <div className="flex-grow sm:flex-grow-0 sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by accused name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button variant="ghost" asChild>
            <Link href="/app/cases">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Number</TableHead>
                <TableHead>Accused</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                // --- FIX: Make row clickable ---
                <TableRow
                  key={item._id}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => setSelectedCaseId(item._id)}
                >
                  <TableCell className="font-medium">
                    {item.Case_Number}
                  </TableCell>
                  <TableCell>{item.Accused_Name}</TableCell>
                  <TableCell>{item.Sections_of_Law}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.Result === "Conviction" ? "default" : "secondary"
                      }
                      className={
                        item.Result === "Conviction"
                          ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      }
                    >
                      {item.Result}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* --- FIX: Add the Modal to the component --- */}
      <CaseDetailModal
        caseId={selectedCaseId}
        isOpen={!!selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
      />
    </motion.div>
  );
}
