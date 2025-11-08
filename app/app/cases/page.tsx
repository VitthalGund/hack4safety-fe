"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import CaseList from "@/components/dashboard/case-list";
import { useGetCases, useGetMetadataFields } from "@/lib/api-services";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

// Schema for the filter form
const caseFilterSchema = z.object({
  district: z.string().optional(),
  court_name: z.string().optional(),
  result: z.string().optional(),
});

type CaseFilterSchema = z.infer<typeof caseFilterSchema>;

export default function CaseExplorerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<CaseFilterSchema>({});
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const queryClient = useQueryClient();

  const form = useForm<CaseFilterSchema>({
    resolver: zodResolver(caseFilterSchema),
    defaultValues: {
      district: "",
      court_name: "",
      result: "",
    },
  });

  // Fetch metadata for dropdowns
  const { data: metadata, isLoading: isLoadingMetadata } =
    useGetMetadataFields();

  // Fetch cases based on search and filters
  const { data: cases, isLoading: isLoadingCases } = useGetCases(
    debouncedSearchTerm,
    filter
  );

  const onSubmit = (values: CaseFilterSchema) => {
    // Remove empty strings from filter values
    const cleanedFilters = Object.entries(values).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key as keyof CaseFilterSchema] = value;
        }
        return acc;
      },
      {} as CaseFilterSchema
    );
    setFilter(cleanedFilters);
  };

  const clearFilters = () => {
    form.reset();
    setFilter({});
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold">Case Explorer</h1>

      <div className="mb-6 space-y-4">
        {/* --- 1. MAIN SEARCH BAR --- */}
        <Input
          placeholder="Search by case number, accused, section, IO..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* --- 2. DISTRICT DROPDOWN --- */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value} // Use value for controlled component
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* <SelectItem value="">All Districts</SelectItem> */}{" "}
                        {/* <-- REMOVED THIS LINE */}
                        {isLoadingMetadata ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          metadata?.districts?.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* --- 3. COURT NAME DROPDOWN --- */}
              <FormField
                control={form.control}
                name="court_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Court Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value} // Use value for controlled component
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a court" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* <SelectItem value="">All Courts</SelectItem> */}{" "}
                        {/* <-- REMOVED THIS LINE */}
                        {isLoadingMetadata ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          metadata?.courts?.map((court) => (
                            <SelectItem key={court} value={court}>
                              {court}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* --- 4. RESULT DROPDOWN (STATIC) --- */}
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Result</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value} // Use value for controlled component
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a result" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* <SelectItem value="">All Results</SelectItem> */}{" "}
                        {/* <-- REMOVED THIS LINE */}
                        <SelectItem value="Conviction">Conviction</SelectItem>
                        <SelectItem value="Acquittal">Acquittal</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">Apply Filters</Button>
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div>
        {isLoadingCases ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <CaseList cases={cases || []} />
        )}
      </div>
    </div>
  );
}
