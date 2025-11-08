"use client";

import type React from "react";

import { ProtectedRoute } from "@/components/protected-route";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/query-provider";
import AppSidebar from "@/components/app/sidebar";
import AppHeader from "@/components/app/header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <ProtectedRoute>
        <div className="flex h-screen bg-white dark:bg-[#0F1729] overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900/50">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </ProtectedRoute>
    </QueryProvider>
  );
}
