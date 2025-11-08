import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./api-client";
import type { Case } from "@/types/case";
import { User } from "@/types/user";
import { UserRole } from "./permissions";

/*
  --------------------
  Types (merged / preferred)
  --------------------
*/

/** Case filter params (extended from code2) */
export type CaseFilterParams = {
  district?: string;
  police_station?: string;
  court_name?: string;
  investigating_officer?: string;
  rank?: string;
  crime_type?: string;
  result?: string;
  sections_of_law?: string;
  pp_name?: string;
  judge_name?: string;
};

/** Metadata fields shape returned for dropdowns (from code2) */
export type MetadataFields = {
  District: string[];
  Police_Station: string[];
  Court_Name: string[];
  Investigating_Officer: string[];
  Rank: string[];
  Crime_Type: string[];
  Result: string[];
  Sections_of_Law: string[];
  PP_Name: string[];
  Judge_Name: string[];
};

/* --------------------
   Analytics-related types (from code1)
   -------------------- */

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

export interface ConvictionChartData {
  name: string;
  ConvictionRate: number;
}

interface ConvictionRateResponse {
  [key: string]: any;
  total_cases: number;
  conviction_rate: number;
}

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

interface ChargesheetResponse {
  summary: any;
  by_group: Array<{
    _id: number;
    total_convictions: number;
    total_acquittals: number;
    total_cases: number;
  }>;
}

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

/*
  --------------------
  Auth API Functions (Using RAW Client)
  --------------------
*/

/**
 * Logs in the user.
 * Uses the raw authApiClient.
 */
export const loginUser = (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  return apiClient.post("/auth/token", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

/**
 * Refreshes the access token.
 * Uses the raw authApiClient.
 */
export const refreshAccessToken = (refreshToken: string) => {
  return apiClient.post(
    "/auth/refresh",
    {},
    {
      headers: { Authorization: `Bearer ${refreshToken}` },
    }
  );
};

/*
  --------------------
  apiService (collection of endpoints)
  --------------------
*/
export const apiService = {
  // Analytics KPIs
  async fetchKPIDurations() {
    return apiClient.get("/analytics/kpi/durations");
  },

  // Conviction Rate Data (simple wrapper)
  async fetchConvictionRate(groupBy: string, filters?: Record<string, string>) {
    const params = new URLSearchParams({ group_by: groupBy });
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return apiClient.get(`/analytics/conviction-rate?${params.toString()}`);
  },

  // Trends Data (legacy wrapper kept)
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

  // Get Metadata for Dropdowns (single field)
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

/*
  --------------------
  High-level helpers exported (from code1)
  --------------------
*/
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

/*
  --------------------
  Trends fetching (detailed transformer) -- merged from code1 (keeps month param)
  --------------------
*/
export const fetchTrends = async (
  period: "monthly" | "yearly",
  year: number | null,
  month: number | null
): Promise<TrendData[]> => {
  const response = await apiClient.get<TrendApiResponse[]>(
    "/analytics/trends",
    {
      params: {
        year: year ?? undefined,
        month: month ?? undefined,
        period,
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
      const date = new Date(item.year, (item.month ?? 1) - 1);
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

/*
  --------------------
  Performance ranking helper (from code1)
  --------------------
*/
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

/*
  --------------------
  Conviction Rate & KPI helpers (from code1)
  --------------------
*/
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

/*
  --------------------
  Chargesheet Sankey (from code1)
  --------------------
*/
export const fetchChargesheetComparison = async (): Promise<SankeyData> => {
  const response = await apiClient.get<ChargesheetResponse>(
    "/analytics/chargesheet-comparison"
  );

  if (!response.data || !Array.isArray(response.data.by_group)) {
    console.error("Invalid data for chargesheet comparison:", response.data);
    throw new Error("Invalid data for chargesheet comparison.");
  }

  const backendData = response.data.by_group;

  const nodes: SankeyNode[] = [
    { id: "Total Cases" },
    { id: "Chargesheeted" },
    { id: "Not Chargesheeted" },
    { id: "Convicted" },
    { id: "Acquitted" },
  ];

  const cs_data = backendData.find((d) => d._id === 1) ?? {
    total_convictions: 0,
    total_acquittals: 0,
  };
  const no_cs_data = backendData.find((d) => d._id === 0) ?? {
    total_convictions: 0,
    total_acquittals: 0,
  };

  const total_chargesheeted =
    cs_data.total_convictions + cs_data.total_acquittals;
  const total_not_chargesheeted =
    no_cs_data.total_convictions + no_cs_data.total_acquittals;

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

/*
  --------------------
  React Query hooks (unified)
  --------------------
*/
export const useGetCases = (q: string, filters: CaseFilterParams) => {
  return useQuery<Case[], Error>({
    queryKey: ["cases", q, filters],
    queryFn: () => getCases(q, filters),
  });
};

export const useGetMetadataFields = () => {
  return useQuery<MetadataFields, Error>({
    queryKey: ["metadataFields"],
    queryFn: getMetadataFields,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// --- User/Admin API Functions (NEW) ---

/**
 * Fetches all users for the admin panel.
 */
const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get("/admin/users");
  return data;
};

/**
 * Creates a new user.
 */
const createUser = async (userData: UserCreateData): Promise<User> => {
  const { data } = await apiClient.post("/admin/users", userData);
  return data;
};

/**
 * A hook to fetch all users for the admin panel.
 */
export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

/**
 * A hook to create a new user.
 * It invalidates the 'users' query on success to refetch the list.
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, UserCreateData>({
    mutationFn: createUser,
    onSuccess: () => {
      // When a user is created, invalidate the 'users' query to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/*
  --------------------
  Accused 360 (prefer code2 implementation hitting real endpoints)
  --------------------
*/
export type AccusedSearchResult = {
  id: string;
  name: string;
  alias: string;
  case_count: number;
};

export type AccusedProfile = {
  id: string;
  name: string;
  aliases: string[];
  is_habitual_offender: boolean;
  case_history: Case[];
};

const searchAccused = async (q: string): Promise<AccusedSearchResult[]> => {
  if (!q) return [];
  const { data } = await apiClient.get(`/accused/search?q=${q}`);
  return data;
};

const getAccusedById = async (id: string): Promise<AccusedProfile> => {
  const { data } = await apiClient.get(`/accused/${id}`);
  return data;
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
    enabled: !!id,
  });
};

export type UserCreateData = {
  username: string;
  full_name: string;
  password: string;
  role: UserRole;
  district?: string;
  police_station?: string;
};

// --- NEW: Types for Analytics ---

export type KpiData = {
  avg_investigation_days: number;
  avg_trial_days: number;
  avg_lifecycle_days: number;
};

export type ConvictionRateData = {
  [key: string]: any; // e.g., "District": "Cuttack"
  total_convictions: number;
  total_acquittals: number;
  total_cases: number;
  conviction_rate: number;
};

export type TrendsData = {
  year: number;
  month: number;
  total_convictions: number;
  total_acquittals: number;
  total_cases: number;
};

export type TrendsFilterParams = {
  crime_type?: string;
  gender?: string;
  age_group?: string;
};

export type PerformanceData = {
  officer_name?: string;
  police_station?: string;
  rank?: string;
  total_convictions: number;
  total_acquittals: number;
  total_cases: number;
  conviction_rate: number;
};

// --- API Functions ---

const getCases = async (
  q: string,
  filters: CaseFilterParams
): Promise<Case[]> => {
  const params = new URLSearchParams();
  if (q) {
    params.append("q", q);
  }
  (Object.keys(filters) as Array<keyof CaseFilterParams>).forEach((key) => {
    const value = filters[key];
    if (value) {
      params.append(key, value);
    }
  });
  const { data } = await apiClient.get("/cases/search", { params });
  return data;
};

const getMetadataFields = async (): Promise<MetadataFields> => {
  const fetchField = async (field: string) => {
    try {
      const { data } = await apiClient.get(`/metadata/distinct/${field}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch metadata for ${field}:`, error);
      return [];
    }
  };

  const [
    District,
    Police_Station,
    Court_Name,
    Investigating_Officer,
    Rank,
    Crime_Type,
    Result,
    Sections_of_Law,
    PP_Name,
    Judge_Name,
    // --- NEW: Fetching new filter data ---
    Gender,
    Age_Group,
  ] = await Promise.all([
    fetchField("District"),
    fetchField("Police_Station"),
    fetchField("Court_Name"),
    fetchField("Investigating_Officer"),
    fetchField("Rank"),
    fetchField("Crime_Type"),
    fetchField("Result"),
    fetchField("Sections_of_Law"),
    fetchField("PP_Name"),
    fetchField("Judge_Name"),
  ]);

  return {
    District,
    Police_Station,
    Court_Name,
    Investigating_Officer,
    Rank,
    Crime_Type,
    Result,
    Sections_of_Law,
    PP_Name,
    Judge_Name,
    Gender,
    Age_Group,
  };
};

// --- NEW: Analytics API Functions ---
const getKpis = async (): Promise<KpiData> => {
  const { data } = await apiClient.get("/analytics/kpi/durations");
  return data;
};

const getConvictionRate = async (
  groupBy: string
): Promise<ConvictionRateData[]> => {
  const { data } = await apiClient.get(
    `/analytics/conviction-rate?group_by=${groupBy}`
  );
  return data;
};

const getTrends = async (
  filters: TrendsFilterParams
): Promise<TrendsData[]> => {
  const params = new URLSearchParams();
  if (filters.crime_type) params.append("crime_type", filters.crime_type);
  if (filters.gender) params.append("gender", filters.gender);
  if (filters.age_group) params.append("age_group", filters.age_group);
  const { data } = await apiClient.get("/analytics/trends", { params });
  return data;
};

const getPerformanceRanking = async (
  groupBy: string
): Promise<PerformanceData[]> => {
  const { data } = await apiClient.get(
    `/analytics/performance/ranking?group_by=${groupBy}`
  );
  return data;
};

const getSankeyData = async (): Promise<SankeyData> => {
  // This API endpoint `/analytics/chargesheet-comparison`
  // is NOT in the backend file you provided.
  // I am mocking it. You must add it to your backend.
  console.warn("Mocking Sankey data. API endpoint not found in backend.");
  return {
    nodes: [
      { id: "IPC 302" },
      { id: "IPC 379" },
      { id: "Conviction" },
      { id: "Acquittal" },
    ],
    links: [
      { source: "IPC 302", target: "Conviction", value: 20 },
      { source: "IPC 302", target: "Acquittal", value: 10 },
      { source: "IPC 379", target: "Conviction", value: 50 },
      { source: "IPC 379", target: "Acquittal", value: 30 },
    ],
  };
};

// --- NEW: Analytics Hooks ---

export const useGetKpis = () => {
  return useQuery<KpiData, Error>({
    queryKey: ["kpis"],
    queryFn: getKpis,
  });
};

export const useGetConvictionRate = (groupBy: string) => {
  return useQuery<ConvictionRateData[], Error>({
    queryKey: ["convictionRate", groupBy],
    queryFn: () => getConvictionRate(groupBy),
  });
};

export const useGetTrends = (filters: TrendsFilterParams) => {
  return useQuery<TrendsData[], Error>({
    queryKey: ["trends", filters],
    queryFn: () => getTrends(filters),
  });
};

export const useGetPerformanceRanking = (groupBy: string) => {
  return useQuery<PerformanceData[], Error>({
    queryKey: ["performanceRanking", groupBy],
    queryFn: () => getPerformanceRanking(groupBy),
  });
};

export const useGetSankeyData = () => {
  return useQuery<SankeyData, Error>({
    queryKey: ["sankeyData"],
    queryFn: getSankeyData,
  });
};
