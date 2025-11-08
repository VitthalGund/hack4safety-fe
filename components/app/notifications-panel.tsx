"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  timestamp: Date
  read: boolean
  actionHref?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Case Updated",
    message: "Case #2024-001 has been updated by SP Officer",
    type: "info",
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
  },
  {
    id: "2",
    title: "Conviction Rate Alert",
    message: "New conviction recorded in Mumbai District",
    type: "success",
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
  },
  {
    id: "3",
    title: "Pending Review",
    message: "Case #2024-003 awaiting your review",
    type: "warning",
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: true,
  },
]

const notificationColors = {
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
}

const notificationTextColors = {
  info: "text-blue-700 dark:text-blue-300",
  warning: "text-amber-700 dark:text-amber-300",
  success: "text-green-700 dark:text-green-300",
  error: "text-red-700 dark:text-red-300",
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 p-0 dark:bg-slate-950 dark:border-slate-800 max-h-96 overflow-hidden"
      >
        <motion.div className="flex flex-col h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                <AnimatePresence mode="popLayout">
                  {notifications.map((notification, i) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-4 ${
                        notificationColors[notification.type]
                      } cursor-pointer hover:opacity-80 transition-opacity group`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-semibold text-sm ${notificationTextColors[notification.type]}`}>
                              {notification.title}
                            </p>
                            {!notification.read && <span className="w-2 h-2 bg-current rounded-full opacity-60" />}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{notification.message}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <motion.button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-white/50 dark:hover:bg-slate-800 rounded"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Check className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-white/50 dark:hover:bg-slate-800 rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
              </div>
            )}
          </div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString()
}
