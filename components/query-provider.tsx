"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * This component provides the React Query client to the application.
 * It's marked as a client component because React Query is a client-side library.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance.
  // We use useState to ensure this instance is only created once per user session,
  // preventing data from being lost on re-renders.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 minute
            refetchOnWindowFocus: false, // Optional: disable refetch on window focus
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
