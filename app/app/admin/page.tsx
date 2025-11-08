"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Settings,
  AlertTriangle,
  BarChart3,
  Shield,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService } from "@/lib/api-services";
import useSWR from "swr";

interface AdminStats {
  total_users: number;
  active_sessions: number;
  system_health: number;
  pending_approvals: number;
}

interface User {
  district: string;
  full_name: string;
  id: number;
  police_station: string;
  role: string;
  username: string;
}

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: statsData, isLoading: statsLoading } = useSWR(
    "/api/admin/stats",
    () => apiService.getAdminStats(),
    {
      revalidateOnFocus: false,
    }
  );

  const { data: usersData, isLoading: usersLoading } = useSWR(
    "/api/admin/users",
    () => apiService.getAdminUsers(),
    {
      revalidateOnFocus: false,
    }
  );

  const stats: AdminStats = statsData?.data || {
    total_users: 0,
    active_sessions: 0,
    system_health: 100,
    pending_approvals: 0,
  };

  const users: User[] = usersData?.data || [];
  console.log({ users });
  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4">
      {/* Header with Role Guard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              System administration and user management
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100/20 border border-red-200/50 rounded-lg dark:bg-red-900/20 dark:border-red-800/50">
            <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
              Admin Access
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {statsLoading ? "..." : stats.total_users}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500/40" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Sessions
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {statsLoading ? "..." : stats.active_sessions}
                  </p>
                </div>
                <Lock className="h-8 w-8 text-green-500/40" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {statsLoading ? "..." : `${stats.system_health}%`}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-indigo-500/40" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card dark:bg-card border-amber-200/50 dark:border-amber-800/50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Approvals
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {statsLoading ? "..." : stats.pending_approvals}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500/40" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Admin Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 bg-card dark:bg-card border border-border rounded-lg p-1">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border bg-card dark:bg-card">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "API Response Time",
                    value: "120ms",
                    status: "good",
                  },
                  { label: "Database Load", value: "45%", status: "good" },
                  { label: "Memory Usage", value: "62%", status: "warning" },
                  { label: "Disk Space", value: "78%", status: "warning" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.status === "good"
                            ? "bg-green-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border bg-card dark:bg-card">
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { action: "User signup", time: "2 mins ago" },
                  { action: "System backup", time: "15 mins ago" },
                  { action: "Data export", time: "1 hour ago" },
                  { action: "Permission updated", time: "3 hours ago" },
                ].map((log, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-foreground">{log.action}</span>
                    <span className="text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary">
              Add User
            </Button>
          </div>

          <Card className="border-border bg-card dark:bg-card">
            <CardContent className="pt-6">
              {usersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Full Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Username
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Police Station
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          District
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user: User, idx: number) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-border/50 hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-foreground font-medium">
                            {user.full_name}
                          </td>
                          <td className="py-3 px-4 text-foreground text-sm">
                            {user.username}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs dark:bg-primary/20">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.police_station === "active"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                                  : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {user.last_login}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              Edit
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Enforce 2FA for all users
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-border dark:border-border bg-transparent"
                  >
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      API Keys Management
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Manage system API keys
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-border dark:border-border bg-transparent"
                  >
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Audit Logs</p>
                    <p className="text-sm text-muted-foreground">
                      View system activity logs
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-border dark:border-border bg-transparent"
                  >
                    View Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground block">
                  System Name
                </label>
                <Input
                  defaultValue="Conviction Data Management System"
                  className="border-border dark:bg-muted dark:border-border"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground block">
                  Maintenance Mode
                </label>
                <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-foreground">
                    Enable maintenance mode
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary">
                  Save Settings
                </Button>
                <Button
                  variant="outline"
                  className="border-border dark:border-border bg-transparent"
                >
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
