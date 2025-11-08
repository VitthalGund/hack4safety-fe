export type UserRole = "super_admin" | "state_police" | "investigating_officer"

export const rolePermissions: Record<UserRole, string[]> = {
  super_admin: [
    "view_dashboard",
    "manage_cases",
    "view_accused",
    "view_geographic",
    "view_analytics",
    "use_ai_assistant",
    "manage_users",
    "manage_settings",
    "access_admin",
  ],
  state_police: [
    "view_dashboard",
    "manage_cases",
    "view_accused",
    "view_geographic",
    "view_analytics",
    "use_ai_assistant",
  ],
  investigating_officer: [
    "view_dashboard",
    "view_cases",
    "manage_accused",
    "view_geographic",
    "view_analytics",
    "use_ai_assistant",
  ],
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: UserRole, permissions: string[]): boolean {
  return permissions.some((perm) => hasPermission(role, perm))
}

export function hasAllPermissions(role: UserRole, permissions: string[]): boolean {
  return permissions.every((perm) => hasPermission(role, perm))
}
