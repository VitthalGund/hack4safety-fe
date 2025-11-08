"use client"
import { useState } from "react"
import { Search } from "lucide-react"

export const AuditTrail = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [logs] = useState([
    {
      id: 1,
      user: "admin@agency.gov",
      action: "Created case FIR-2024-001",
      timestamp: "2024-11-08 14:30",
      status: "success",
    },
    {
      id: 2,
      user: "sp@agency.gov",
      action: "Updated case status to chargesheeted",
      timestamp: "2024-11-08 13:15",
      status: "success",
    },
    {
      id: 3,
      user: "judge@courts.gov",
      action: "Failed login attempt",
      timestamp: "2024-11-08 12:45",
      status: "failed",
    },
  ])

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search audit logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-foreground">User</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-muted-foreground text-xs">{log.user}</td>
                  <td className="py-3 px-4 text-foreground">{log.action}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        log.status === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
