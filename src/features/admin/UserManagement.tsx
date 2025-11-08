"use client"
import { useState } from "react"
import { Plus, Edit, Trash2, Search } from "lucide-react"

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [users] = useState([
    { id: 1, name: "Rajesh Sharma", email: "rajesh@agency.gov", role: "admin", status: "active" },
    { id: 2, name: "Priya Desai", email: "priya@agency.gov", role: "sp", status: "active" },
    { id: 3, name: "Judge H.S. Reddy", email: "reddy@courts.gov", role: "judge", status: "active" },
  ])

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <button className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground">{user.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-semibold">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-semibold">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="p-2 hover:bg-muted rounded transition-colors text-muted-foreground">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 hover:bg-destructive/20 rounded transition-colors text-destructive">
                      <Trash2 size={16} />
                    </button>
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
