"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchAccused, useGetAccusedById } from "@/lib/api-services";
import CaseList from "@/components/dashboard/case-list";
import { Badge } from "@/components/ui/badge";

export default function Accused360Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccusedId, setSelectedAccusedId] = useState<string | null>(
    null
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const { data: searchResults, isLoading: isSearching } =
    useSearchAccused(debouncedSearchTerm);

  const { data: accusedProfile, isLoading: isLoadingProfile } =
    useGetAccusedById(selectedAccusedId);

  const handleSelectAccused = (id: string) => {
    setSearchTerm(""); // Clear search bar
    setSelectedAccusedId(id);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold">Accused 360°</h1>

      <div className="mb-6 space-y-2">
        <Input
          placeholder="Search for an accused by name or alias..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedAccusedId(null); // Clear profile when typing
          }}
        />
        {/* Search Results Dropdown */}
        {debouncedSearchTerm && (
          <Card className="absolute z-10 w-full max-w-md">
            <CardContent className="p-2">
              {isSearching && <div className="p-2 text-sm">Searching...</div>}
              {!isSearching && searchResults && searchResults.length === 0 && (
                <div className="p-2 text-sm">No results found.</div>
              )}
              {!isSearching && searchResults && searchResults.length > 0 && (
                <ul className="space-y-1">
                  {searchResults.map((accused) => (
                    <li
                      key={accused.id}
                      className="cursor-pointer rounded p-2 hover:bg-muted"
                      onClick={() => handleSelectAccused(accused.id)}
                    >
                      <div className="font-medium">{accused.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {accused.alias && `(Alias: ${accused.alias}) `}
                        Cases: {accused.case_count}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Profile Display */}
      {isLoadingProfile && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      )}

      {accusedProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <span>{accusedProfile.name}</span>
              {accusedProfile.is_habitual_offender && (
                <Badge variant="destructive">Habitual Offender</Badge>
              )}
            </CardTitle>
            <div className="text-muted-foreground">
              {accusedProfile.aliases?.length > 0 &&
                `Aliases: ${accusedProfile.aliases.join(", ")}`}
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="mb-4 text-xl font-semibold">Case History</h3>
            <CaseList cases={accusedProfile.case_history || []} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
