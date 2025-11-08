"use client"
import { useAccusedProfile, useAccusedNetwork } from "@/api/apiHooks"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { CaseHistoryTimeline } from "./CaseHistoryTimeline"
import { AccusedNetworkGraph } from "./AccusedNetworkGraph"
import { Users, Calendar, AlertCircle } from "lucide-react"

interface AccusedProfileProps {
  accusedId: string
}

export const AccusedProfile = ({ accusedId }: AccusedProfileProps) => {
  const { data: profile, isLoading: profileLoading } = useAccusedProfile(accusedId)
  const { data: networkData, isLoading: networkLoading } = useAccusedNetwork(accusedId)

  if (profileLoading || networkLoading) {
    return <LoadingSpinner message="Loading accused profile..." />
  }

  if (!profile) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Accused profile not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">ID</p>
                <p className="font-mono text-foreground">{profile.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Age</p>
                <p className="text-foreground">{profile.age}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Gender</p>
                <p className="text-foreground">{profile.gender}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Occupation</p>
                <p className="text-foreground">{profile.occupation || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Address</p>
                <p className="text-foreground text-sm">{profile.address}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Status</p>
                <p className="text-foreground">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      profile.status === "active" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {profile.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="space-y-3 md:w-64 flex-shrink-0">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-foreground">
                <AlertCircle size={18} className="text-accent" />
                <span className="text-sm font-semibold">{profile.totalCases} Total Cases</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <AlertCircle size={18} className="text-green-400" />
                <span className="text-sm font-semibold">{profile.convictions} Convictions</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <AlertCircle size={18} className="text-red-400" />
                <span className="text-sm font-semibold">{profile.acquittals} Acquittals</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar size={18} className="text-muted-foreground" />
                <span className="text-sm">Last case: {profile.lastCaseDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case History Timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Case History</h2>
        <CaseHistoryTimeline cases={profile.caseHistory || []} />
      </div>

      {/* Network Graph */}
      {networkData && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users size={20} />
            Co-Accused Network
          </h2>
          <AccusedNetworkGraph networkData={networkData} />
        </div>
      )}

      {/* Recidivism Alert */}
      {profile.isRecidivist && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h3 className="font-semibold text-red-400 flex items-center gap-2 mb-2">
            <AlertCircle size={18} />
            Recidivism Pattern
          </h3>
          <p className="text-sm text-muted-foreground">
            This individual has multiple prior convictions and a history of re-offending. Average time between offenses:{" "}
            {profile.averageIntervalBetweenCrimes} days.
          </p>
        </div>
      )}
    </div>
  )
}
