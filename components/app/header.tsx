"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchCommand } from "./search-command"
import { NotificationsPanel } from "./notifications-panel"
import { LogOut, User, Settings, Sun, Moon } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AppHeader() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <motion.header
      className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 flex items-center justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</h2>
        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
          {user?.role?.replace(/_/g, " ").toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Command */}
        <SearchCommand />

        {/* Notifications */}
        <NotificationsPanel />

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </motion.button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white hidden sm:inline">
                {user?.name?.split(" ")[0]}
              </span>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dark:bg-slate-950 dark:border-slate-800">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400">
                <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                <p>{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="dark:bg-slate-800" />
              <DropdownMenuItem asChild>
                <Link href="/app/profile" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/settings" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-slate-800" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
