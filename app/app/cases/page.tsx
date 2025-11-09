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
// import CaseList from "@/components/dashboard/case-list"; // <-- REMOVED
import {
  useGetCases,
  useGetMetadataFields,
  CaseFilterParams,
} from "@/lib/api-services";
import { Skeleton } from "@/components/ui/skeleton";

// --- INLINED COMPONENTS ---
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import CaseDetailModal from "@/components/dashboard/case-detail-modal";
import { Case } from "@/types/case";
import { Card } from "@tremor/react";
// --- END INLINED ---

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

  // --- NEW: Pagination and Modal state ---
  const [page, setPage] = useState(1);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const itemsPerPage = 10;
  // --- END NEW ---

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

  // --- MODIFIED: Fetch cases with pagination ---
  const { data: casesResponse, isLoading: isLoadingCases } = useGetCases(
    debouncedSearchTerm,
    filter,
    page
  );

  const cases = casesResponse || [];
  const totalCases = casesResponse?.length || 0;
  const totalPages = Math.ceil(totalCases / itemsPerPage);
  // --- END MODIFIED ---

  const onSubmit = (values: CaseFilterSchema) => {
    setPage(1); // Reset to first page on new filter
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
    setPage(1);
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
    // Handle potential undefined metadata
    return metadata?.[field]?.map((item) => (
      <SelectItem key={item} value={item} className="truncate">
        {item}
      </SelectItem>
    ));
  };

  // --- NEW: Pagination handlers ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  // --- END NEW ---

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
            {/* --- [Dropdown FormFields remain unchanged] --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

      {/* --- MODIFIED: Inlined CaseList logic --- */}
      <div>
        {isLoadingCases ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Accused</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Police Station</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((item: Case) => (
                  <TableRow
                    key={item._id}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => setSelectedCaseId(item._id)}
                  >
                    <TableCell className="font-medium">
                      {item.Case_Number}
                    </TableCell>
                    <TableCell>{item.Accused_Name}</TableCell>
                    <TableCell>{item.Sections_of_Law}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.Result === "Conviction" ? "default" : "secondary"
                        }
                        className={
                          item.Result === "Conviction"
                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        }
                      >
                        {item.Result}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.District}</TableCell>
                    <TableCell>{item.Police_Station}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* --- NEW: Pagination Component --- */}
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                      className={
                        page <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {/* Simplified Pagination: Just show current page */}
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="p-2 text-sm text-muted-foreground">
                      Total Pages: {totalPages}
                    </span>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            {/* --- END NEW --- */}
          </Card>
        )}
      </div>
      {/* --- END INLINED --- */}

      {/* --- NEW: Inlined Modal --- */}
      <CaseDetailModal
        caseId={selectedCaseId}
        isOpen={!!selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
      />
    </div>
  );
}
