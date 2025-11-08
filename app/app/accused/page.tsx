"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Network, MapPin, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api-services"
import useSWR from "swr"

interface Accused {
  id: string
  name: string
  age: number
  gender: string
  criminal_history: number
  connected_cases: number
  status: string
}

export default function AccusedPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAccused, setSelectedAccused] = useState<Accused | null>(null)

  const { data: accusedData, isLoading } = useSWR(
    "/api/accused/search",
    () => apiService.searchAccused({ query: searchTerm, limit: 50 }),
    { revalidateOnFocus: false },
  )

  const accused = accusedData?.data || []

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Accused 360°</h1>
        <p className="text-muted-foreground">Search and analyze accused individuals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List and Detail */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAccused ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <AccusedProfileView accused={selectedAccused} onBack={() => setSelectedAccused(null)} />
            </motion.div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : accused.length === 0 ? (
                <Card className="border-border bg-card dark:bg-card">
                  <CardContent className="pt-8 text-center">
                    <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No accused found</p>
                  </CardContent>
                </Card>
              ) : (
                accused.map((person: Accused, index: number) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedAccused(person)}
                  >
                    <Card className="cursor-pointer border-border bg-card dark:bg-card hover:border-primary/50 transition-all hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{person.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Age: {person.age} • Gender: {person.gender}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              <span>Criminal records: {person.criminal_history}</span>
                              <span>Cases: {person.connected_cases}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100">
                              {person.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AccusedProfileView({
  accused,
  onBack,
}: {
  accused: Accused
  onBack: () => void
}) {
  const { data: profileData, isLoading } = useSWR(
    `/api/accused/${accused.id}/profile`,
    () => apiService.getAccusedProfile(accused.id),
    { revalidateOnFocus: false },
  )

  const { data: networkData } = useSWR(
    `/api/accused/${accused.id}/network`,
    () => apiService.getAccusedNetwork(accused.id),
    { revalidateOnFocus: false },
  )

  const profile = profileData?.data || accused
  const network = networkData?.data || { nodes: [], edges: [] }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4 text-muted-foreground hover:text-foreground">
        Back to Search
      </Button>

      {/* Profile Header */}
      <Card className="border-border bg-card dark:bg-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-foreground">{profile.name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                Age {profile.age} • {profile.gender}
              </p>
            </div>
            <span className="px-4 py-2 bg-orange-100/20 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300 rounded-lg font-medium">
              {profile.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Criminal History</label>
              <p className="text-2xl font-bold text-foreground mt-1">{profile.criminal_history}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Connected Cases</label>
              <p className="text-2xl font-bold text-foreground mt-1">{profile.connected_cases}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Graph */}
      <Card className="border-border bg-card dark:bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Connection Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 bg-muted rounded-lg animate-pulse" />
          ) : (
            <div className="h-64 bg-muted/30 dark:bg-muted/20 rounded-lg flex items-center justify-center border border-border">
              <p className="text-muted-foreground">Network visualization loading...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Associated Locations */}
      <Card className="border-border bg-card dark:bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Associated Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { place: "Mumbai Central", cases: 3 },
              { place: "Bandra", cases: 2 },
              { place: "Dadar", cases: 1 },
            ].map((location, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                <span className="text-foreground">{location.place}</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs dark:bg-primary/20">
                  {location.cases} cases
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
