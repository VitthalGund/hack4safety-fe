"use client";
import { useAuthStore } from "@/src/state/authStore";
import { useAlertsFeed } from "@/src/api/apiHooks";
import { Bell, LogOut, Search } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const { user, logout } = useAuthStore();
  const { data: alerts } = useAlertsFeed();
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = alerts?.filter((a: any) => !a.read).length || 0;

  return (
    <header className="sticky top-0 z-30 w-full bg-card border-b border-border">
      <div className="md:ml-64 flex items-center justify-between px-6 py-4 gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search cases, accused, judges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          {/* Alerts */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User profile */}
          <div className="flex items-center gap-2 pl-4 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="ml-2 p-2 hover:bg-muted rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
