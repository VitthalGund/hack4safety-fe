"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-[#0F1729] dark:to-[#1a2847] flex items-center justify-center p-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-block p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-6"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <Shield className="w-12 h-12 text-red-600 dark:text-red-400" />
        </motion.div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          You don't have permission to access this resource. Please contact your administrator if you believe this is an
          error.
        </p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button
            onClick={() => router.push("/app/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
