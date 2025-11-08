import { Case } from "@/types/case";
import apiClient from "./api-client";
import { useQuery } from "@tanstack/react-query";

// --- Types and Functions for Trends Chart ---
interface TrendApiResponse {
  year: number;
  month: number;
  total_convictions: number;
  total_acquittals: number;
  total_cases: number;
}
export interface TrendData {
  date: string;
  Convicted: number;
  Acquitted: number;
  "Total Cases": number;
}
export const fetchTrends = async (
  period: "monthly" | "yearly",
  year: number | null,
  month: number | null // <-- FIX: Added month parameter
): Promise<TrendData[]> => {
  // --- FIX: Pass params to the API call ---
  const response = await apiClient.get<TrendApiResponse[]>(
    "/analytics/trends",
    {
      params: {
        year: year || undefined,
        month: month || undefined, // <-- FIX: Pass month to API
      },
    }
  );

  if (!Array.isArray(response.data)) {
    throw new Error("Invalid data format received from server.");
  }
  const transformedData: TrendData[] = response.data.map((item) => {
    let dateString: string;
    if (period === "yearly" && !year) {
      dateString = item.year.toString();
    } else {
      const date = new Date(item.year, item.month - 1);
      dateString = date.toLocaleDateString("en-US", {
        month: "short",
        year: year ? undefined : "numeric",
      });
    }

    return {
      date: dateString,
      Convicted: item.total_convictions,
      Acquitted: item.total_acquittals,
      "Total Cases": item.total_cases,
    };
  });
  return transformedData;
};

export const apiService = {
  // Analytics KPIs
  async fetchKPIDurations() {
    return apiClient.get("/analytics/kpi/durations");
  },

  // Conviction Rate Data
  async fetchConvictionRate(groupBy: string, filters?: Record<string, string>) {
    const params = new URLSearchParams({ group_by: groupBy });
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return apiClient.get(`/analytics/conviction-rate?${params.toString()}`);
  },

  // Trends Data
  async fetchTrends(period: "monthly" | "yearly", natureOfOffence?: string) {
    const params = new URLSearchParams({ period });
    if (natureOfOffence) params.append("nature_of_offence", natureOfOffence);
    return apiClient.get(`/analytics/trends?${params.toString()}`);
  },

  // Personnel Performance Ranking
  async fetchPerformanceRanking(entityType: "io" | "pp" | "unit", limit = 10) {
    return apiClient.get(
      `/analytics/performance/ranking?entity_type=${entityType}&limit=${limit}`
    );
  },

  // Chargesheet Comparison
  async fetchChargesheetComparison() {
    return apiClient.get("/analytics/chargesheet-comparison");
  },

  // Case Search
  async searchCases(
    query: string,
    filters?: Record<string, string>,
    skip = 0,
    limit = 20
  ) {
    const params = new URLSearchParams({
      q: query,
      skip: skip.toString(),
      limit: limit.toString(),
    });
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return apiClient.get(`/cases/search?${params.toString()}`);
  },

  // Get Case Detail
  async getCaseDetail(caseId: string) {
    return apiClient.get(`/cases/${caseId}`);
  },

  // Search Accused
  async searchAccused(params: { query: string; limit?: number }) {
    const queryParams = new URLSearchParams({ q: params.query });
    if (params.limit) queryParams.append("limit", params.limit.toString());
    return apiClient.get(`/accused/search?${queryParams.toString()}`);
  },

  // Get Accused Profile
  async getAccusedProfile(accusedId: string) {
    return apiClient.get(`/accused/${accusedId}/profile`);
  },

  // Get Accused Network
  async getAccusedNetwork(accusedId: string) {
    return apiClient.get(`/accused/${accusedId}/network`);
  },

  // Get Geographic Data
  async getGeographicData() {
    return apiClient.get("/analytics/geographic");
  },

  // Get Personnel Scorecard
  async getPersonnelScorecard() {
    return apiClient.get("/personnel/scorecards");
  },

  // Get Trend Analytics
  async getTrendAnalytics(period: string) {
    return apiClient.get(`/analytics/trends?period=${period}`);
  },

  // Get Chargesheet Analytics
  async getChargesheetAnalytics() {
    return apiClient.get("/analytics/chargesheet");
  },

  // Get Admin Stats
  async getAdminStats() {
    return apiClient.get("/admin/stats");
  },

  // Get Admin Users
  async getAdminUsers() {
    return apiClient.get("/admin/users");
  },

  // Get Current User
  async fetchCurrentUser() {
    return apiClient.get("/auth/users/me");
  },

  // Get Metadata for Dropdowns
  async fetchMetadata(fieldName: string) {
    return apiClient.get(`/metadata/distinct/${fieldName}`);
  },

  // Get Alerts/Feed
  async fetchAlerts() {
    return apiClient.get("/alerts/feed");
  },

  // Mark Alert as Read
  async markAlertAsRead(alertId: string) {
    return apiClient.put(`/alerts/${alertId}/read`);
  },

  // Get Insights
  async fetchInsights() {
    return apiClient.get("/insights");
  },
};

export async function fetchKPIDurations() {
  return apiService.fetchKPIDurations();
}

export async function fetchPerformanceRanking(
  entityType: "io" | "pp" | "unit",
  limit = 10
) {
  return apiService.fetchPerformanceRanking(entityType, limit);
}

export async function searchCases(
  query: string,
  filters?: Record<string, string>,
  skip = 0,
  limit = 20
) {
  return apiService.searchCases(query, filters, skip, limit);
}

export async function fetchCurrentUser() {
  return apiService.fetchCurrentUser();
}

export async function fetchMetadata(fieldName: string) {
  return apiService.fetchMetadata(fieldName);
}

export async function fetchAlerts() {
  return apiService.fetchAlerts();
}

export async function markAlertAsRead(alertId: string) {
  return apiService.markAlertAsRead(alertId);
}

export async function fetchInsights() {
  return apiService.fetchInsights();
}

// 1. Define the shape the FRONTEND component expects
export interface RankingData {
  rank: number;
  name: string;
  unit: string;
  convictionRate: number;
  totalCases: number;
}
interface OfficerRankingResponse {
  officer_name: string;
  rank: string;
  total_cases: number;
  conviction_rate: number;
}
interface StationRankingResponse {
  police_station: string;
  total_cases: number;
  conviction_rate: number;
}
export const fetchPerformanceRankings = async (
  groupBy: "Investigating_Officer" | "Police_Station",
  skip: number = 0,
  limit: number = 5
): Promise<RankingData[]> => {
  const response = await apiClient.get<
    OfficerRankingResponse[] | StationRankingResponse[]
  >("/analytics/performance/ranking", {
    params: {
      group_by: groupBy,
      skip: skip,
      limit: limit,
    },
  });
  if (!Array.isArray(response.data)) {
    throw new Error("Invalid data format for rankings.");
  }
  if (groupBy === "Investigating_Officer") {
    return (response.data as OfficerRankingResponse[]).map((item, index) => ({
      rank: skip + index + 1,
      name: item.officer_name,
      unit: item.rank,
      convictionRate: item.conviction_rate * 100,
      totalCases: item.total_cases,
    }));
  } else {
    return (response.data as StationRankingResponse[]).map((item, index) => ({
      rank: skip + index + 1,
      name: item.police_station,
      unit: "N/A",
      convictionRate: item.conviction_rate * 100,
      totalCases: item.total_cases,
    }));
  }
};

// --- Types and Functions for Conviction Rate Chart (Phase 3, Step 3) ---
export interface ConvictionChartData {
  name: string;
  ConvictionRate: number;
}
interface ConvictionRateResponse {
  [key: string]: any;
  total_cases: number;
  conviction_rate: number;
}
export const fetchConvictionRate = async (
  groupBy: "District" | "Court_Name" | "Crime_Type"
): Promise<ConvictionChartData[]> => {
  const response = await apiClient.get<ConvictionRateResponse[]>(
    "/analytics/conviction-rate",
    {
      params: { group_by: groupBy },
    }
  );
  if (!Array.isArray(response.data)) {
    throw new Error("Invalid data format for conviction rate.");
  }
  const transformedData: ConvictionChartData[] = response.data.map((item) => ({
    name: item[groupBy],
    ConvictionRate: parseFloat((item.conviction_rate * 100).toFixed(1)),
  }));
  return transformedData;
};

// --- Types and Functions for KPI Cards (Phase 3, Step 4) ---
export interface KPIData {
  totalCases: number;
  avgLifecycleDays: number;
  avgInvestigationDays: number;
  avgTrialDays: number;
}
interface DurationsResponse {
  avg_investigation_days: number;
  avg_trial_days: number;
  avg_lifecycle_days: number;
}
export const fetchKPIs = async (): Promise<KPIData> => {
  const [durationsRes, convictionRateRes] = await Promise.all([
    apiClient.get<DurationsResponse>("/analytics/kpi/durations"),
    apiClient.get<ConvictionRateResponse[]>("/analytics/conviction-rate", {
      params: { group_by: "District" },
    }),
  ]);
  const durationsData = durationsRes.data;
  if (!Array.isArray(convictionRateRes.data)) {
    throw new Error("Invalid data for KPI total cases.");
  }
  const totalCases = convictionRateRes.data.reduce(
    (acc, curr) => acc + curr.total_cases,
    0
  );
  return {
    totalCases: totalCases,
    avgLifecycleDays: durationsData.avg_lifecycle_days,
    avgInvestigationDays: durationsData.avg_investigation_days,
    avgTrialDays: durationsData.avg_trial_days,
  };
};

// --- Types and Function for Chargesheet Sankey ---

export interface SankeyNode {
  id: string;
}
export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}
export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Interface for the ACTUAL API response you provided
interface ChargesheetResponse {
  summary: any; // We don't use this part
  by_group: Array<{
    _id: number; // 0 for Not Chargesheeted, 1 for Chargesheeted
    total_convictions: number;
    total_acquittals: number;
    total_cases: number;
  }>;
}

// 3. Implement the API service function
export const fetchChargesheetComparison = async (): Promise<SankeyData> => {
  const response = await apiClient.get<ChargesheetResponse>(
    "/analytics/chargesheet-comparison"
  );

  // --- FIX: Check the nested 'by_group' array ---
  if (!response.data || !Array.isArray(response.data.by_group)) {
    console.error("Invalid data for chargesheet comparison:", response.data);
    throw new Error("Invalid data for chargesheet comparison.");
  }

  const backendData = response.data.by_group;

  // 4. Define nodes
  const nodes: SankeyNode[] = [
    { id: "Total Cases" },
    { id: "Chargesheeted" },
    { id: "Not Chargesheeted" },
    { id: "Convicted" },
    { id: "Acquitted" },
  ];

  // 5. Process backend data
  // Find the data for "Chargesheeted" (_id: 1)
  const cs_data = backendData.find((d) => d._id === 1) ?? {
    total_convictions: 0,
    total_acquittals: 0,
  };
  // Find the data for "Not Chargesheeted" (_id: 0)
  const no_cs_data = backendData.find((d) => d._id === 0) ?? {
    total_convictions: 0,
    total_acquittals: 0,
  };

  const total_chargesheeted =
    cs_data.total_convictions + cs_data.total_acquittals;
  const total_not_chargesheeted =
    no_cs_data.total_convictions + no_cs_data.total_acquittals;

  // 6. Create links
  const links: SankeyLink[] = [
    {
      source: "Total Cases",
      target: "Chargesheeted",
      value: total_chargesheeted,
    },
    {
      source: "Total Cases",
      target: "Not Chargesheeted",
      value: total_not_chargesheeted,
    },
    {
      source: "Chargesheeted",
      target: "Convicted",
      value: cs_data.total_convictions,
    },
    {
      source: "Chargesheeted",
      target: "Acquitted",
      value: cs_data.total_acquittals,
    },
    {
      source: "Not Chargesheeted",
      target: "Convicted",
      value: no_cs_data.total_convictions,
    },
    {
      source: "Not Chargesheeted",
      target: "Acquitted",
      value: no_cs_data.total_acquittals,
    },
  ].filter((link) => link.value > 0);

  return { nodes, links };
};

export interface PersonnelScorecard {
  officer_name: string;
  rank: string;
  total_cases: number;
  total_convictions: number;
  total_acquittals: number;
  conviction_rate: number;
  avg_investigation_duration_days: number;
  common_acquittal_reasons: string[];
  recent_cases: Array<{ id: string; Case_Number: string; Result: string }>;
}

export const fetchPersonnelScorecard = async (
  name: string
): Promise<PersonnelScorecard> => {
  const response = await apiClient.get<PersonnelScorecard>(
    `/analytics/performance/personnel/${name}`
  );
  return response.data;
};

// 2. Fetch Case Details
export const fetchCaseDetails = async (caseId: string): Promise<Case> => {
  const response = await apiClient.get<Case>(`/cases/${caseId}`);
  return response.data;
};

export async function getAdminStats() {
  return apiService.getAdminStats();
}

export async function getAdminUsers() {
  return apiService.getAdminUsers();
}

export async function askLegalBot(query: string, model: string = "gemini") {
  return apiClient.post("/rag/legal", { query, model_provider: model });
}

export async function askCaseBot(query: string, model: string = "gemini") {
  return apiClient.post("/rag/cases", { query, model_provider: model });
}

/**
 * Defines the structure for the case filter parameters.
 */
type CaseFilterParams = {
  district?: string;
  court_name?: string;
  result?: string;
};

/**
 * Defines the response structure for the metadata fields API.
 * This is used to populate the dropdowns.
 */
type MetadataFields = {
  sections_of_law: string[];
  courts: string[];
  judges: string[];
  districts: string[];
  police_stations: string[];
  io_names: string[];
  pp_names: string[];
  // Note: The 'result' field is static ["Conviction", "Acquittal"]
  // and handled in the component, so it's not expected from this API.
};

// --- API Functions ---

/**
 * Fetches the list of cases based on a search query and filters.
 * @param q - The main search term (for case number, accused, etc.)
 * @param filters - An object containing structured filters (district, court, etc.)
 * @returns A promise that resolves to an array of Case objects.
 */
const getCases = async (
  q: string,
  filters: CaseFilterParams
): Promise<Case[]> => {
  const params = new URLSearchParams();

  // Add main search query if it exists
  if (q) {
    // The backend's /api/v1/cases.py search endpoint uses these fields for 'q'
    // This is a simulated 'q' parameter as the backend code you provided
    // doesn't have a single 'q' param, but separate fields.
    // We will map 'q' to the fields the backend *does* support.
    // A better backend implementation would have a single 'q' text search.
    // For now, we'll assume 'q' maps to 'accused_name' as a primary text search.
    params.append("accused_name", q);
    // You can add more fields here if your backend 'q' searches them
    // params.append("sections_of_law", q);
    // params.append("investigating_officer", q);
  }

  // Add filter parameters, skipping empty/undefined values
  (Object.keys(filters) as Array<keyof CaseFilterParams>).forEach((key) => {
    const value = filters[key];
    if (value) {
      params.append(key, value);
    }
  });

  const { data } = await apiClient.get("/api/v1/cases/search", { params });
  return data;
};

/**
 * Fetches the consolidated metadata for all filter dropdowns.
 * @returns A promise that resolves to the MetadataFields object.
 */
const getMetadataFields = async (): Promise<MetadataFields> => {
  // This endpoint is not in the provided backend code.
  // The backend has `/api/v1/metadata/distinct/{field_name}`.
  // A true implementation would call this multiple times.
  // We will simulate the *planned* `/api/v1/metadata/fields` endpoint
  // by calling the `distinct` endpoint for each required field.

  const fetchField = async (field: string) => {
    try {
      const { data } = await apiClient.get(`/metadata/distinct/${field}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch metadata for ${field}:`, error);
      return []; // Return empty array on error
    }
  };

  // Fetch all metadata fields in parallel
  const [
    districts,
    courts,
    judges,
    police_stations,
    io_names,
    pp_names,
    sections_of_law,
  ] = await Promise.all([
    fetchField("District"),
    fetchField("Court_Name"),
    fetchField("Judge_Name"), // Assuming this exists in your data
    fetchField("Police_Station"),
    fetchField("Investigating_Officer"),
    fetchField("PP_Name"), // Assuming this exists in your data
    fetchField("Sections_of_Law"), // Assuming this exists
  ]);

  return {
    districts,
    courts,
    judges,
    police_stations,
    io_names,
    pp_names,
    sections_of_law,
  };
};

// --- React Query Hooks ---

/**
 * A custom React Query hook to fetch cases.
 * It automatically refetches when 'q' or 'filters' change.
 */
export const useGetCases = (q: string, filters: CaseFilterParams) => {
  return useQuery<Case[], Error>({
    queryKey: ["cases", q, filters], // This key auto-refetches when q or filters change
    queryFn: () => getCases(q, filters),
  });
};

/**
 * A custom React Query hook to fetch all metadata fields for dropdowns.
 * This data is cached and re-used across the app.
 */
export const useGetMetadataFields = () => {
  return useQuery<MetadataFields, Error>({
    queryKey: ["metadataFields"],
    queryFn: getMetadataFields,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

// --- Accused 360 Hooks (from plan) ---
// These are not used by Case Explorer but are part of the plan

type AccusedSearchResult = {
  id: string;
  name: string;
  alias: string;
  case_count: number;
};

type AccusedProfile = {
  id: string;
  name: string;
  aliases: string[];
  is_habitual_offender: boolean;
  case_history: Case[];
};

const searchAccused = async (q: string): Promise<AccusedSearchResult[]> => {
  // This API is not in the provided backend code, we are assuming its future implementation
  // For now, we'll return a mock. Replace with:
  // const { data } = await apiClient.get(`/api/v1/accused/search?q=${q}`);
  // return data;
  if (!q) return [];
  return [
    { id: "mock-123", name: "Mock Accused", alias: "Mocky", case_count: 2 },
  ];
};

const getAccusedById = async (id: string): Promise<AccusedProfile> => {
  // This API is not in the provided backend code, we are assuming its future implementation
  // For now, we'll return a mock. Replace with:
  // const { data } = await apiClient.get(`/api/v1/accused/${id}`);
  // return data;
  return {
    id: id,
    name: "Mock Accused",
    aliases: ["Mocky"],
    is_habitual_offender: true,
    case_history: [],
  };
};

export const useSearchAccused = (q: string) => {
  return useQuery<AccusedSearchResult[], Error>({
    queryKey: ["accusedSearch", q],
    queryFn: () => searchAccused(q),
  });
};

export const useGetAccusedById = (id: string | null) => {
  return useQuery<AccusedProfile, Error>({
    queryKey: ["accusedProfile", id],
    queryFn: () => getAccusedById(id!),
    enabled: !!id, // Only run the query if an ID is provided
  });
};
