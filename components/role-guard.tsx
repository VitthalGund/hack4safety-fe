"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"

interface RoleGuardProps {
  requiredRoles?: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ requiredRoles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user) return fallback

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return fallback
  }

  return <>{children}</>
}
