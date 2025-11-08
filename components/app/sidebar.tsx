"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Map,
  BarChart3,
  Brain,
  Settings,
  HelpCircle,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { UserRole } from "@/lib/auth-store"; // Import UserRole

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Cases",
    href: "/app/cases",
    icon: Briefcase,
  },
  {
    label: "Accused",
    href: "/app/accused",
    icon: Users,
  },
  {
    label: "Geographic",
    href: "/app/geographic",
    icon: Map,
  },
  {
    label: "Analytics",
    href: "/app/analytics",
    icon: BarChart3,
  },
  {
    label: "AI Assistant",
    href: "/app/ai-assistant",
    icon: Brain,
  },
];

const adminItems = [
  {
    label: "Admin",
    href: "/app/admin",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const items = [...sidebarItems];
  // --- FIX: Check against the UserRole enum from auth-store ---
  if (user?.role === UserRole.ADMIN) {
    items.push(...adminItems);
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed md:relative z-40 h-screen w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300",
          isOpen ? "left-0" : "-left-64 md:left-0"
        )}
        initial={false}
      >
        {/* Header */}
        <motion.div
          className="p-6 border-b border-slate-200 dark:border-slate-800"
          whileHover={{ scale: 1.02 }}
        >
          <Link href="/app/dashboard" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                CrimeLabs
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Intelligence
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              // --- FIX: Moved whileHover from Link to this motion.div ---
              <motion.div key={item.href} whileHover={{ x: 4 }}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                  // --- FIX: Removed whileHover from here ---
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer Items */}
        <motion.div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-2">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </Link>
        </motion.div>
      </motion.aside>
    </>
  );
}
