import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./api-client";
import type { Case } from "@/types/case";
import { User } from "@/types/user";
import { UserRole } from "./permissions";
import axios from "axios";

/*
  --------------------
  RAW Auth Client
  --------------------
*/
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
});

/*
  --------------------
  Auth API Functions (Using RAW Client)
  --------------------
*/
export const loginUser = (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  return authApiClient.post("/auth/token", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const refreshAccessToken = (refreshToken: string) => {
  return authApiClient.post(
    "/auth/refresh",
    {},
    {
      headers: { Authorization: `Bearer ${refreshToken}` },
    }
  );
};

/*
  --------------------
  Types
  --------------------
*/

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
  Gender: string[];
  Age_Group: string[];
  Term_Unit: string[];
};

// Raw response from /trends
interface TrendApiResponse {
  year: number;
  month: number;
  total_convictions: number;
  total_acquittals: number;
  total_cases: number;
}
// Transformed data for the chart
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
interface UnitRankingResponse {
  unit_name: string;
  total_cases: number;
  conviction_rate: number;
}
export interface AcquittalChartData {
  name: string;
  AcquittalRate: number;
}

export interface ConvictionChartData {
  name: string;
  ConvictionRate: number;
}

interface RateResponse {
  [key: string]: any;
  total_cases: number;
  total_convictions: number;
  total_acquittals: number;
  conviction_rate: number;
  acquittal_rate: number;
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
  API FUNCTIONS
  --------------------
*/
// This object seems fine, no changes needed.
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
  High-level helpers exported
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
  Trends fetching (detailed transformer)
  --------------------
*/
export const fetchTrends = async (
  // --- FEATURE: Added year and month ---
  year: number | null,
  month: number | null,
  crimeType?: string | null
): Promise<TrendData[]> => {
  const params = new URLSearchParams();
  if (year) params.append("year", year.toString());
  if (month) params.append("month", month.toString());
  if (crimeType) params.append("crime_type", crimeType);

  const response = await apiClient.get<TrendApiResponse[]>(
    `/analytics/trends?${params.toString()}`
  );

  if (!Array.isArray(response.data)) {
    throw new Error("Invalid data format received from server.");
  }

  const transformedData: TrendData[] = response.data.map((item) => {
    // Format date as "MMM 'YY" (e.g., "Jan '23")
    const date = new Date(item.year, (item.month ?? 1) - 1);
    const dateString = date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });

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
  Performance ranking helper
  --------------------
*/
// --- FEATURE: Updated type and logic for Term_Unit ---
export const fetchPerformanceRankings = async (
  groupBy: "Investigating_Officer" | "Police_Station" | "Term_Unit",
  skip: number = 0,
  limit: number = 5
): Promise<RankingData[]> => {
  const response = await apiClient.get<
    (OfficerRankingResponse | StationRankingResponse | UnitRankingResponse)[]
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

  // Use a type guard or property check
  if (groupBy === "Investigating_Officer") {
    return (response.data as OfficerRankingResponse[]).map((item, index) => ({
      rank: skip + index + 1,
      name: item.officer_name,
      unit: item.rank,
      convictionRate: item.conviction_rate * 100,
      totalCases: item.total_cases,
    }));
  } else if (groupBy === "Police_Station") {
    return (response.data as StationRankingResponse[]).map((item, index) => ({
      rank: skip + index + 1,
      name: item.police_station,
      unit: "N/A",
      convictionRate: item.conviction_rate * 100,
      totalCases: item.total_cases,
    }));
  } else {
    // --- FIX: Handle Term_Unit mapping ---
    return (response.data as UnitRankingResponse[]).map((item, index) => ({
      rank: skip + index + 1,
      name: item.unit_name, // This field comes from the backend
      unit: "Unit",
      convictionRate: item.conviction_rate * 100,
      totalCases: item.total_cases,
    }));
  }
};

/*
  --------------------
  Rate & KPI helpers
  --------------------
*/
const COMMON_GROUP_BY = "District";

export const fetchConvictionRate = async (
  groupBy: string
): Promise<ConvictionChartData[]> => {
  const response = await apiClient.get<RateResponse[]>(
    "/analytics/conviction-rate",
    {
      params: { group_by: groupBy },
    }
  );
  if (!Array.isArray(response.data)) {
    throw new Error("Invalid data format for conviction rate.");
  }
  return response.data.map((item) => ({
    name: item[groupBy] || "Uncategorized",
    ConvictionRate: parseFloat((item.conviction_rate * 100).toFixed(1)),
  }));
};

// --- FEATURE: Added Acquittal Rate function ---
export const fetchAcquittalRate = async (
  groupBy: string
): Promise<AcquittalChartData[]> => {
  const response = await apiClient.get<RateResponse[]>(
    "/analytics/acquittal-rate",
    {
      params: { group_by: groupBy },
    }
  );
  if (!Array.isArray(response.data)) {
    throw new Error("Invalid data format for acquittal rate.");
  }
  return response.data.map((item) => ({
    name: item[groupBy] || "Uncategorized",
    AcquittalRate: parseFloat((item.acquittal_rate * 100).toFixed(1)),
  }));
};

export const fetchKPIs = async (): Promise<KPIData> => {
  const [durationsRes, convictionRateRes] = await Promise.all([
    apiClient.get<DurationsResponse>("/analytics/kpi/durations"),
    apiClient.get<RateResponse[]>("/analytics/conviction-rate", {
      params: { group_by: COMMON_GROUP_BY },
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
    avgLifecycleDays: Math.round(durationsData.avg_lifecycle_days || 0),
    avgInvestigationDays: Math.round(durationsData.avg_investigation_days || 0),
    avgTrialDays: Math.round(durationsData.avg_trial_days || 0),
  };
};

/*
  --------------------
  Chargesheet Sankey
  --------------------
*/
export const fetchChargesheetComparison = async (): Promise<SankeyData> => {
  const response = await apiClient.get<ChargesheetResponse>(
    "/analytics/chargesheet-comparison"
  );
  // ... (this logic is complex but correct, no changes needed) ...
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

// ... (fetchPersonnelScorecard, fetchCaseDetails, admin, RAG functions are fine) ...
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
  React Query hooks
  --------------------
*/
// --- FIX: Added skip and limit to useGetCases ---

// --- Analytics Types & Functions ---

export type KpiData = {
  avg_investigation_days: number;
  avg_trial_days: number;
  avg_lifecycle_days: number;
};

export type ConvictionRateData = {
  [key: string]: any;
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
  crime_type?: string | null;
  year?: number | null;
  month?: number | null;
};

export type PerformanceData = {
  officer_name?: string;
  police_station?: string;
  unit_name?: string;
  rank?: string;
  total_convictions: number;
  total_acquittals: number;
  total_cases: number;
  conviction_rate: number;
};

// --- API Functions ---
const getCases = async (
  q: string,
  filters: CaseFilterParams,
  skip: number = 0,
  limit: number = 10
): Promise<Case[]> => {
  const params = new URLSearchParams();
  if (q) params.append("q", q);

  params.append("skip", skip.toString());
  params.append("limit", limit.toString());

  (Object.keys(filters) as Array<keyof CaseFilterParams>).forEach((key) => {
    const value = filters[key as keyof CaseFilterParams];
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
      // --- FIX: Filter out null or empty strings ---
      return (
        data.filter((item: string | null) => item && item.trim() !== "") || []
      );
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
    Gender,
    Age_Group,
    Term_Unit,
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
    fetchField("Gender"),
    fetchField("Age_Group"),
    fetchField("Term_Unit"),
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
    Term_Unit,
  };
};

// --- (Other API functions: getKpis, getConvictionRate, etc. remain here) ---
const getKpis = async (): Promise<KPIData> => {
  const { data } = await apiClient.get("/analytics/kpi/durations");
  // This is a simplified fetch, real KPIs should be aggregated
  const kpiData = {
    totalCases: data.total_cases || 0, // Assuming kpi/durations returns this
    avgLifecycleDays: Math.round(data.avg_lifecycle_days || 0),
    avgInvestigationDays: Math.round(data.avg_investigation_days || 0),
    avgTrialDays: Math.round(data.avg_trial_days || 0),
  };
  // We need to fetch total cases separately
  const rateResponse = await apiClient.get(
    "/analytics/conviction-rate?group_by=District"
  );
  kpiData.totalCases = rateResponse.data.reduce(
    (acc: number, curr: any) => acc + curr.total_cases,
    0
  );
  return kpiData;
};

const getConvictionRate = async (
  groupBy: string
): Promise<ConvictionRateData[]> => {
  const { data } = await apiClient.get(
    `/analytics/conviction-rate?group_by=${groupBy}`
  );
  return data;
};

const getTrends = async (filters: TrendsFilterParams): Promise<TrendData[]> => {
  const params = new URLSearchParams();
  if (filters.crime_type) params.append("crime_type", filters.crime_type);
  if (filters.year) params.append("year", filters.year.toString());
  if (filters.month) params.append("month", filters.month.toString());

  const { data } = await apiClient.get<TrendApiResponse[]>(
    "/analytics/trends",
    { params }
  );

  if (!Array.isArray(data)) {
    throw new Error("Invalid data format received from server.");
  }

  // Transform data for the chart
  return data.map((item: TrendApiResponse) => {
    const date = new Date(item.year, item.month - 1);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      Convicted: item.total_convictions, // Map backend name to chart key
      Acquitted: item.total_acquittals, // Map backend name to chart key
      "Total Cases": item.total_cases, // Map backend name to chart key
    };
  });
};

const getPerformanceRanking = async (
  groupBy: string,
  skip: number,
  limit: number
): Promise<RankingData[]> => {
  const { data } = await apiClient.get<
    (OfficerRankingResponse | StationRankingResponse | UnitRankingResponse)[]
  >(
    `/analytics/performance/ranking?group_by=${groupBy}&skip=${skip}&limit=${limit}`
  );

  if (groupBy === "Investigating_Officer") {
    return (data as OfficerRankingResponse[]).map((item, index) => ({
      rank: skip + index + 1,
      name: item.officer_name,
      unit: item.rank,
      convictionRate: (item.conviction_rate || 0) * 100,
      totalCases: item.total_cases,
    }));
  } else if (groupBy === "Police_Station") {
    return (data as StationRankingResponse[]).map((item, index) => ({
      rank: skip + index + 1,
      name: item.police_station,
      unit: "N/A",
      convictionRate: (item.conviction_rate || 0) * 100,
      totalCases: item.total_cases,
    }));
  } else {
    // Term_Unit
    return (data as UnitRankingResponse[]).map((item, index) => ({
      rank: skip + index + 1,
      name: item.unit_name,
      unit: "Unit",
      convictionRate: (item.conviction_rate || 0) * 100,
      totalCases: item.total_cases,
    }));
  }
};

// --- 4. GET ACQUITTAL RATE ---
const getAcquittalRate = async (
  groupBy: string
): Promise<AcquittalChartData[]> => {
  const { data } = await apiClient.get<RateResponse[]>(
    "/analytics/acquittal-rate",
    {
      params: { group_by: groupBy },
    }
  );
  if (!Array.isArray(data)) {
    throw new Error("Invalid data format for acquittal rate.");
  }
  return data.map((item) => ({
    name: item[groupBy] || "Uncategorized",
    AcquittalRate: parseFloat(((item.acquittal_rate || 0) * 100).toFixed(1)),
  }));
};

const getSankeyData = async (): Promise<SankeyData> => {
  const { data } = await apiClient.get<ChargesheetResponse>(
    "/analytics/chargesheet-comparison"
  );
  if (!data || !Array.isArray(data.by_group)) {
    throw new Error("Invalid data for chargesheet comparison.");
  }
  const backendData = data.by_group;
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
    (cs_data.total_convictions || 0) + (cs_data.total_acquittals || 0);
  const total_not_chargesheeted =
    (no_cs_data.total_convictions || 0) + (no_cs_data.total_acquittals || 0);
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

// ... (Accused, Admin, RAG functions) ...
const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get("/admin/users");
  return data;
};
export type UserCreateData = {
  username: string;
  full_name: string;
  password: string;
  role: UserRole;
  district?: string;
  police_station?: string;
};
const createUser = async (userData: UserCreateData): Promise<User> => {
  const { data } = await apiClient.post("/admin/users", userData);
  return data;
};
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
  const { data } = await apiClient.get(`/accused/${id}/profile`); // Use the correct endpoint
  return data;
};

/*
  --------------------
  React Query hooks
  --------------------
*/

// --- 5. USE GET CASES (Fixed for Pagination) ---
export const useGetCases = (
  q: string,
  filters: CaseFilterParams,
  skip: number,
  limit: number
) => {
  return useQuery<Case[], Error>({
    queryKey: ["cases", q, filters, skip, limit],
    queryFn: () => getCases(q, filters, skip, limit),
    keepPreviousData: true,
  });
};

export const useGetMetadataFields = () => {
  return useQuery<MetadataFields, Error>({
    queryKey: ["metadataFields"],
    queryFn: getMetadataFields,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGetKpis = () => {
  return useQuery<KPIData, Error>({
    queryKey: ["kpis"],
    queryFn: getKpis,
  });
};

export const useGetConvictionRate = (groupBy: string) => {
  return useQuery<ConvictionChartData[], Error>({
    queryKey: ["convictionRate", groupBy],
    queryFn: () => getConvictionRate(groupBy),
  });
};

// --- 6. USE GET ACQUITTAL RATE (New Hook) ---
export const useGetAcquittalRate = (groupBy: string) => {
  return useQuery<AcquittalChartData[], Error>({
    queryKey: ["acquittalRate", groupBy],
    queryFn: () => getAcquittalRate(groupBy),
  });
};

// --- 7. USE GET TRENDS (Fixed params) ---
export const useGetTrends = (filters: TrendsFilterParams) => {
  return useQuery<TrendData[], Error>({
    queryKey: ["trends", filters],
    queryFn: () => getTrends(filters),
  });
};

export const useGetPerformanceRanking = (
  groupBy: string,
  skip: number,
  limit: number
) => {
  return useQuery<RankingData[], Error>({
    queryKey: ["performanceRanking", groupBy, skip, limit],
    queryFn: () => getPerformanceRanking(groupBy, skip, limit),
    keepPreviousData: true,
  });
};

export const useGetSankeyData = () => {
  return useQuery<SankeyData, Error>({
    queryKey: ["sankeyData"],
    queryFn: getSankeyData,
  });
};

// --- (Admin hooks) ---
export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, UserCreateData>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// --- (Accused hooks) ---
export const useSearchAccused = (q: string) => {
  return useQuery<AccusedSearchResult[], Error>({
    queryKey: ["accusedSearch", q],
    queryFn: () => searchAccused(q),
    enabled: !!q,
  });
};

export const useGetAccusedById = (id: string | null) => {
  return useQuery<AccusedProfile, Error>({
    queryKey: ["accusedProfile", id],
    queryFn: () => getAccusedById(id!),
    enabled: !!id,
  });
};

// --- (Case Detail hook) ---
export const useGetCaseById = (id: string | null) => {
  return useQuery<Case, Error>({
    queryKey: ["caseDetail", id],
    queryFn: () => fetchCaseDetails(id!),
    enabled: !!id,
  });
};
