"use client";

import { useState } from "react";
import {
  Card,
  List,
  ListItem,
  Text,
  Title,
  Badge,
  BadgeProps,
  Col,
  Grid,
} from "@tremor/react";
import {
  useSearchAccused,
  useGetAccusedById,
  AccusedSearchResult,
} from "@/lib/api-services";
import {
  Loader2,
  Search,
  User,
  AlertCircle,
  History,
  Info,
  LinkIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Case } from "@/types/case";
import { ScrollArea } from "@/components/ui/scroll-area";
import CaseDetailModal from "@/components/dashboard/case-detail-modal";
import { useDebounce } from "@/hooks/use-debounce";

const resultColorMap: { [key: string]: BadgeProps["color"] } = {
  Convicted: "emerald",
  Acquitted: "rose",
};

export default function Accused360Page() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const {
    data: searchResults,
    isLoading: isSearching,
    isError: isSearchError,
    error: searchError,
  } = useSearchAccused(debouncedQuery);

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
  } = useGetAccusedById(selectedId);

  return (
    <Grid numItemsLg={3} className="gap-6 h-[calc(100vh-100px)]">
      {/* Left Column: Search and Results */}
      <Col numColSpanLg={1} className="h-full">
        <Card className="h-full flex flex-col dark:border-slate-700">
          <Title className="p-6 dark:text-white">Search Accused</Title>
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by name or alias..."
                className="pl-9 dark:bg-slate-700 dark:border-slate-600"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-grow">
            {isSearching && (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            )}
            {isSearchError && (
              <div className="p-6">
                <Text color="rose">{searchError.message}</Text>
              </div>
            )}
            <List>
              {!isSearching &&
                !isSearchError &&
                searchResults &&
                searchResults.map((accused: AccusedSearchResult) => (
                  <ListItem
                    key={accused.id}
                    className={`cursor-pointer ${
                      selectedId === accused.id
                        ? "bg-indigo-50 dark:bg-slate-700"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => setSelectedId(accused.id)}
                  >
                    <div className="flex justify-between w-full">
                      <div>
                        <Text className="dark:text-white font-medium">
                          {accused.name}
                        </Text>
                        <Text className="dark:text-slate-400">
                          {accused.alias}
                        </Text>
                      </div>
                      <Badge color="gray">{accused.case_count} cases</Badge>
                    </div>
                  </ListItem>
                ))}
              {!isSearching &&
                debouncedQuery &&
                searchResults?.length === 0 && (
                  <ListItem className="justify-center">
                    <Text>No results found.</Text>
                  </ListItem>
                )}
            </List>
          </ScrollArea>
        </Card>
      </Col>

      {/* Right Column: Profile Details */}
      <Col numColSpanLg={2} className="h-full">
        <Card className="h-full flex flex-col dark:border-slate-700">
          <Title className="p-6 dark:text-white">Accused Profile</Title>
          <ScrollArea className="flex-grow">
            {isLoadingProfile && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            )}
            {isProfileError && (
              <div className="flex flex-col items-center justify-center h-full text-red-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <Title color="rose">Error</Title>
                <Text>
                  {profileError.message || "Could not load accused profile."}
                </Text>
              </div>
            )}
            {!selectedId && !isLoadingProfile && !isProfileError && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <User className="w-16 h-16 mb-4" />
                <Title>Select an Accused</Title>
                <Text>Search for an accused to see their profile.</Text>
              </div>
            )}
            {profile && (
              <div className="p-6 space-y-6">
                {/* Profile Header */}
                <div className="pb-4 border-b dark:border-slate-700">
                  <Title className="dark:text-white">{profile.name}</Title>
                  <Text className="dark:text-slate-400">
                    Aliases: {profile.aliases?.join(", ") || "None"}
                  </Text>
                  {profile.is_habitual_offender && (
                    <Badge color="red" className="mt-2">
                      Habitual Offender
                    </Badge>
                  )}
                </div>

                {/* Case History */}
                <div>
                  <Title
                    color="indigo"
                    className="flex items-center gap-2 dark:text-indigo-400"
                  >
                    <History className="w-5 h-5" />
                    Case History
                  </Title>
                  <List className="mt-2">
                    {profile.case_history?.map((caseItem: Case) => (
                      <ListItem
                        key={caseItem._id}
                        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => setSelectedCaseId(caseItem._id)}
                      >
                        <div className="flex justify-between w-full">
                          <div>
                            <Text className="dark:text-white font-medium">
                              {caseItem.Case_Number}
                            </Text>
                            <Text className="dark:text-slate-400">
                              {caseItem.Police_Station}
                            </Text>
                          </div>
                          <Badge
                            color={resultColorMap[caseItem.Result] || "gray"}
                          >
                            {caseItem.Result}
                          </Badge>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </div>
              </div>
            )}
          </ScrollArea>
        </Card>
      </Col>

      <CaseDetailModal
        caseId={selectedCaseId}
        isOpen={!!selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
      />
    </Grid>
  );
}
