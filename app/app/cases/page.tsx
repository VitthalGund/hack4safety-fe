"use client";

import { useState } from "react";
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
import {
  useGetCases,
  useGetMetadataFields,
  CaseFilterParams,
} from "@/lib/api-services";
import { Skeleton } from "@/components/ui/skeleton";

// Schema for the filter form
const caseFilterSchema = z.object({
  district: z.string().optional(),
  police_station: z.string().optional(),
  court_name: z.string().optional(),
  investigating_officer: z.string().optional(),
  rank: z.string().optional(),
  crime_type: z.string().optional(),
  result: z.string().optional(),
  sections_of_law: z.string().optional(),
  pp_name: z.string().optional(),
  judge_name: z.string().optional(),
});

type CaseFilterSchema = z.infer<typeof caseFilterSchema>;

export default function CaseExplorerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<CaseFilterParams>({});
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const form = useForm<CaseFilterSchema>({
    resolver: zodResolver(caseFilterSchema),
    defaultValues: {
      district: "",
      police_station: "",
      court_name: "",
      investigating_officer: "",
      rank: "",
      crime_type: "",
      result: "",
      sections_of_law: "",
      pp_name: "",
      judge_name: "",
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

  // Helper to render dropdown options
  const renderSelectItems = (field: keyof typeof metadata) => {
    if (isLoadingMetadata) {
      return (
        <SelectItem value="loading" disabled>
          Loading...
        </SelectItem>
      );
    }
    return metadata?.[field]?.map((item) => (
      <SelectItem key={item} value={item} className="truncate">
        {item}
      </SelectItem>
    ));
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
            {/* Responsive grid: reflows from 1 -> 2 -> 3 -> 4 -> 5 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* --- 2. ALL 10 DROPDOWNS --- */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer">
                    <FormLabel className="mb-1 text-sm">District</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select a district" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("District")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="police_station"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer">
                    <FormLabel className="mb-1 text-sm">
                      Police Station
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select a police station" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("Police_Station")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="court_name"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer">
                    <FormLabel className="mb-1 text-sm">Court Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select a court" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("Court_Name")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investigating_officer"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer">
                    <FormLabel className="mb-1 text-sm">
                      Investigating Officer
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select an IO" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("Investigating_Officer")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer">
                    <FormLabel className="mb-1 text-sm">Rank</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select a rank" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("Rank")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crime_type"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer">
                    <FormLabel className="mb-1 text-sm">Crime Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select a crime type" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("Crime_Type")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer">
                    <FormLabel className="mb-1 text-sm">Result</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select a result" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("Result")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sections_of_law"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer">
                    <FormLabel className="mb-1 text-sm">
                      Sections of Law
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("Sections_of_Law")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pp_name"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer">
                    <FormLabel className="mb-1 text-sm">
                      Public Prosecutor (PP)
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select a PP" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("PP_Name")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="judge_name"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 cursor-pointer cursor-pointer">
                    <FormLabel className="mb-1 text-sm">Judge Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full min-w-0 cursor-pointer">
                          <SelectValue placeholder="Select a judge" />
                        </SelectTrigger>
                        <SelectContent className="w-full max-h-64 overflow-auto">
                          {renderSelectItems("Judge_Name")}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end items-center space-x-2">
              <Button type="submit" className="cursor-pointer">
                Apply Filters
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={clearFilters}
              >
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
