"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }

    if (!isLoading && isAuthenticated && user && requiredRoles && !requiredRoles.includes(user.role)) {
      router.push("/app/unauthorized")
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0F1729] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (user && requiredRoles && !requiredRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
