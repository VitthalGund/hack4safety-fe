"use client"
import { useState } from "react"
import { Key, RotateCw, AlertCircle } from "lucide-react"

export const PQCPanel = () => {
  const [pqcStatus, setPqcStatus] = useState({
    registered: true,
    lastRotation: "2024-11-01",
    keysActive: 3,
  })

  const handleRegisterAgent = () => {
    console.log("Registering PQC agent...")
    // API call
  }

  const handleRotateKeys = () => {
    console.log("Rotating keys...")
    // API call
    setPqcStatus((prev) => ({
      ...prev,
      lastRotation: new Date().toISOString().split("T")[0],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Key size={20} />
          PQC Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Agent Status</p>
            <p className="text-2xl font-bold text-green-400">{pqcStatus.registered ? "Active" : "Inactive"}</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Last Key Rotation</p>
            <p className="text-lg font-semibold text-foreground">{pqcStatus.lastRotation}</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Active Keys</p>
            <p className="text-2xl font-bold text-primary">{pqcStatus.keysActive}</p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
        <AlertCircle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-400">Post-Quantum Cryptography</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ensure you rotate keys periodically to maintain quantum-safe security.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleRegisterAgent}
          className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors text-left"
        >
          <h3 className="font-semibold text-foreground mb-2">Register PQC Agent</h3>
          <p className="text-sm text-muted-foreground">Initialize or re-register the quantum-safe agent</p>
        </button>
        <button
          onClick={handleRotateKeys}
          className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors text-left flex items-center justify-between"
        >
          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <RotateCw size={18} />
              Rotate Keys
            </h3>
            <p className="text-sm text-muted-foreground">Generate new PQC key pairs</p>
          </div>
        </button>
      </div>
    </div>
  )
}
