"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Spinner } from "@/components/ui/spinner"; // CORRECTED import path

// Hard-code the known login path
const LOGIN_PATH = "/auth/login";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const { pathname } = usePathname();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // This effect runs on the client after mount.
  // By this time, the store will have rehydrated from localStorage.
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only run the auth check *after* the component has hydrated.
    if (isHydrated && !isAuthenticated) {
      router.push(LOGIN_PATH); // CORRECTED path
    }
  }, [isHydrated, isAuthenticated, router, pathname]);

  // While hydrating, show a loader to prevent layout shifts
  // or flashing the login page.
  if (!isHydrated) {
    // Show a full-page loader
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If hydrated and authenticated, show the app.
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If hydrated and not authenticated, the useEffect is redirecting.
  // Return a loader to prevent flashing content.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner size={"30px"} />
    </div>
  );
}
