"use client"

import { useAuth } from "./use-auth"
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions"

export function usePermissions() {
  const { user } = useAuth()

  if (!user) {
    return {
      can: () => false,
      canAny: () => false,
      canAll: () => false,
    }
  }

  return {
    can: (permission: string) => hasPermission(user.role, permission),
    canAny: (permissions: string[]) => hasAnyPermission(user.role, permissions),
    canAll: (permissions: string[]) => hasAllPermissions(user.role, permissions),
  }
}
