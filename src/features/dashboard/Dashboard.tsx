"use client"
import { useAuthStore } from "@/state/authStore"
import { PoliceDashboard } from "./PoliceDashboard"
import { JudicialDashboard } from "./JudicialDashboard"
import { AdminDashboard } from "./AdminDashboard"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"

export const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <LoadingSpinner />
  }

  // Route to role-specific dashboard
  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "sp":
    case "dgp":
      return <PoliceDashboard />
    case "judge":
    case "lawyer":
      return <JudicialDashboard />
    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-lg font-semibold text-foreground">Welcome</h2>
          <p className="text-muted-foreground">Start by exploring the cases or accused profiles.</p>
        </div>
      )
  }
}
