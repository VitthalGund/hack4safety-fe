import { useAuthStore } from "../state/authStore"

const rolePermissions: Record<string, string[]> = {
  admin: ["dashboard", "cases", "accused", "analytics", "geo", "rag", "admin", "audit"],
  sp: ["dashboard", "cases", "accused", "analytics", "geo", "rag"],
  dgp: ["dashboard", "cases", "accused", "analytics", "geo", "rag"],
  judge: ["dashboard", "cases", "accused", "rag"],
  lawyer: ["cases", "accused", "rag"],
  io: ["cases", "accused"],
  liaison: ["cases", "admin"],
}

export const usePermissions = () => {
  const { user } = useAuthStore()

  const hasPermission = (feature: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role]?.includes(feature) || false
  }

  const canAccess = (features: string[]): boolean => {
    return features.some((f) => hasPermission(f))
  }

  return { hasPermission, canAccess }
}
