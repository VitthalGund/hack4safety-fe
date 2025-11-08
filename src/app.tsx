"use client";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuthMe, useMetadataFields } from "@/src/api/apiHooks";
import { useAuthStore } from "@/src/state/authStore";
import { queryClient } from "@/src/utils/queryClient";

// Feature components (to be built)
import { LoginPage } from "@/src/features/auth/LoginPage";
import { Dashboard } from "@/src/features/dashboard/Dashboard";
import { CaseExplorer } from "@/src/features/cases/CaseExplorer";
import { AccusedExplorer } from "@/src/features/accused/AccusedExplorer";
import { GeospatialHub } from "@/src/features/geo/GeospatialHub";
import { AnalyticsHub } from "@/src/features/analytics/AnalyticsHub";
import { RagPage } from "@/src/features/rag/RagPage";
import { AdminPanel } from "@/src/features/admin/AdminPanel";
import { ProtectedRoute } from "@/src/features/auth/ProtectedRoute";

// Layout
import { PageShell } from "@/src/components/layout/PageShell";

function AppContent() {
  const { setUser } = useAuthStore();
  const { data: user, isLoading } = useAuthMe();

  // Prefetch metadata for all users
  useMetadataFields();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border border-primary border-t-transparent"></div>
      </div>
    );
  }

  const token = localStorage.getItem("authToken");
  if (!token) {
    return <LoginPage />;
  }

  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/cases"
          element={
            <ProtectedRoute requiredPermission="cases">
              <CaseExplorer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accused"
          element={
            <ProtectedRoute requiredPermission="accused">
              <AccusedExplorer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/geo"
          element={
            <ProtectedRoute requiredPermission="geo">
              <GeospatialHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredPermission="analytics">
              <AnalyticsHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rag"
          element={
            <ProtectedRoute requiredPermission="rag">
              <RagPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredPermission="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Navigate to="/" replace />} />
      </Routes>
    </PageShell>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}
