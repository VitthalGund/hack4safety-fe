"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  FileDown,
  AlertCircle,
  Shield,
  Globe,
  Building,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";

type ReportRole = "sp" | "dgp" | "home";

// Based on the CSV files
const reportOptions = [
  {
    role: "sp",
    title: "SP District Report",
    icon: Building,
    description:
      "Tactical performance hotspots, AI-driven gaps, and acquittal reasons for your district.",
    allowedRoles: ["admin", "district", "police"],
  },
  {
    role: "dgp",
    title: "DGP Strategic Report",
    icon: Shield,
    description:
      "State-level KPI trends, chargesheet-to-conviction flow, and district performance rankings.",
    allowedRoles: ["admin", "district"], // 'district' for SPs to see state comparison
  },
  {
    role: "home",
    title: "Home Dept. Policy Report",
    icon: Globe,
    description:
      "Digital platform impact summary, resource justification, and AI-informed policy recommendations.",
    allowedRoles: ["admin"], // Only admin for this high-level report
  },
];

export default function ReportsPage() {
  const [loadingRole, setLoadingRole] = useState<ReportRole | null>(null);
  const { user } = useAuthStore();
  const userRole = user?.role || "viewer";

  const handleDownload = async (role: ReportRole) => {
    setLoadingRole(role);
    try {
      const response = await apiClient.get("/reports/generate-report", {
        params: { role },
        responseType: "blob", // This is crucial for file downloads
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${role}_report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report generated successfully!");
    } catch (err: any) {
      console.error("Report generation failed:", err);
      let errorMsg = "Failed to generate report.";
      // Try to parse error from blob if it's a JSON error response
      if (err.response?.data && err.response.data.type === "application/json") {
        try {
          const errorJson = JSON.parse(await err.response.data.text());
          errorMsg = errorJson.detail || errorMsg;
        } catch (e) {
          // Fallback if blob is not JSON
          errorMsg = err.message || errorMsg;
        }
      } else {
        errorMsg = err.message || errorMsg;
      }
      toast.error(errorMsg);
    } finally {
      setLoadingRole(null);
    }
  };

  // Filter reports based on the user's role
  const availableReports = reportOptions.filter((report) =>
    report.allowedRoles.includes(userRole)
  );

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Generate Reports</h1>
      <p className="text-muted-foreground">
        Select a report to generate a real-time PDF summary based on your role.
      </p>

      {availableReports.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Reports Available</AlertTitle>
          <AlertDescription>
            Your user role ({userRole}) does not have permission to generate
            reports.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableReports.map((report) => {
          const Icon = report.icon;
          const isLoading = loadingRole === report.role;
          return (
            <Card key={report.role} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className="w-8 h-8 text-primary" />
                  <CardTitle>{report.title}</CardTitle>
                </div>
                <CardDescription className="pt-2">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => handleDownload(report.role as ReportRole)}
                  disabled={!!loadingRole}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Generating..." : "Download PDF"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
