"use client"
import type { ReactNode } from "react"
import { useAuthStore } from "@/state/authStore"
import { usePermissions } from "@/hooks/usePermissions"
import { LoginPage } from "./LoginPage"

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  requiredPermissions?: string[]
}

export const ProtectedRoute = ({ children, requiredPermission, requiredPermissions = [] }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore()
  const { hasPermission, canAccess } = usePermissions()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const permissions = requiredPermission ? [requiredPermission] : requiredPermissions

  if (permissions.length > 0 && !canAccess(permissions)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
