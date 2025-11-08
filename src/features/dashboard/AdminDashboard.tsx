"use client"
import { KPICard } from "@/components/common/KPICard"
import { Users, Database, AlertTriangle, Zap } from "lucide-react"

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">System administration and analytics</p>
      </div>

      {/* System KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Users"
          value={42}
          trend={12}
          description="System active users"
          icon={<Users size={24} />}
        />
        <KPICard
          title="Total Cases"
          value={1250}
          trend={5}
          description="Cases in system"
          icon={<Database size={24} />}
        />
        <KPICard title="System Health" value="99.8%" description="Uptime this month" icon={<Zap size={24} />} />
        <KPICard title="Audit Events" value={3450} description="Events this month" icon={<AlertTriangle size={24} />} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/admin/users"
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer"
        >
          <Users size={24} className="text-primary mb-3" />
          <h3 className="font-semibold text-foreground">User Management</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage system users and permissions</p>
        </a>
        <a
          href="/admin/audit"
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer"
        >
          <AlertTriangle size={24} className="text-primary mb-3" />
          <h3 className="font-semibold text-foreground">Audit Trail</h3>
          <p className="text-sm text-muted-foreground mt-1">View system audit logs</p>
        </a>
        <a
          href="/admin/pqc"
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer"
        >
          <Database size={24} className="text-primary mb-3" />
          <h3 className="font-semibold text-foreground">PQC Management</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage PQC settings</p>
        </a>
      </div>
    </div>
  )
}
