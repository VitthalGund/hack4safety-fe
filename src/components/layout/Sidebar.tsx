"use client";
import Link from "next/link";
import { useAuthStore } from "@/src/state/authStore";
import { useUIStore } from "@/src/state/uiStore";
import { usePermissions } from "@/src/hooks/usePermissions";
import {
  Menu,
  X,
  BarChart3,
  FolderOpen,
  Users,
  MapPin,
  Brain,
  Settings,
} from "lucide-react";

export const Sidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { hasPermission } = usePermissions();

  const menuItems = [
    { label: "Dashboard", href: "/", icon: BarChart3, permission: "dashboard" },
    { label: "Cases", href: "/cases", icon: FolderOpen, permission: "cases" },
    {
      label: "Accused 360°",
      href: "/accused",
      icon: Users,
      permission: "accused",
    },
    { label: "Geospatial", href: "/geo", icon: MapPin, permission: "geo" },
    {
      label: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      permission: "analytics",
    },
    { label: "RAG Assistant", href: "/rag", icon: Brain, permission: "rag" },
    { label: "Admin", href: "/admin", icon: Settings, permission: "admin" },
  ];

  const visibleItems = menuItems.filter((item) =>
    hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-muted rounded-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Intelligence
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">
            {user?.role.toUpperCase()}
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => useUIStore.setState({ sidebarOpen: false })}
        />
      )}
    </>
  );
};
