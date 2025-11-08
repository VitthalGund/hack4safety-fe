"use client"
import { useState } from "react"
import { UserManagement } from "./UserManagement"
import { DataEntryForm } from "./DataEntryForm"
import { PQCPanel } from "./PQCPanel"
import { AuditTrail } from "./AuditTrail"
import { Users, Database, Key, FileText } from "lucide-react"

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<"users" | "data" | "pqc" | "audit">("users")

  const tabs = [
    { id: "users", label: "User Management", icon: Users },
    { id: "data", label: "Data Entry", icon: Database },
    { id: "pqc", label: "PQC Settings", icon: Key },
    { id: "audit", label: "Audit Trail", icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Administration Panel</h1>
        <p className="text-muted-foreground mt-2">System configuration and management</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "users" && <UserManagement />}
        {activeTab === "data" && <DataEntryForm />}
        {activeTab === "pqc" && <PQCPanel />}
        {activeTab === "audit" && <AuditTrail />}
      </div>
    </div>
  )
}
