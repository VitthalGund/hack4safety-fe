import apiClient from "./api-client";

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
  year: number | null // <-- FIX: Added year parameter
): Promise<TrendData[]> => {
  // --- FIX: Pass params to the API call ---
  const response = await apiClient.get<TrendApiResponse[]>(
    "/analytics/trends",
    {
      params: {
        // The backend doesn't use 'period', but we pass 'year'
        year: year || undefined, // Send 'undefined' if year is null
      },
    }
  );

  if (!Array.isArray(response.data)) {
    throw new Error("Invalid data format received from server.");
  }
  const transformedData: TrendData[] = response.data.map((item) => {
    const date = new Date(item.year, item.month - 1);

    // --- FIX: Adjust date format based on whether a year is selected ---
    const dateString = date.toLocaleDateString("en-US", {
      month: "short",
      year: year ? undefined : "numeric", // Only show year if no filter is set
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
  groupBy: "Investigating_Officer" | "Police_Station"
): Promise<RankingData[]> => {
  const response = await apiClient.get<
    OfficerRankingResponse[] | StationRankingResponse[]
  >("/analytics/performance/ranking", {
    params: { group_by: groupBy },
  });
  if (!Array.isArray(response.data)) {
    throw new Error("Invalid data format for rankings.");
  }
  if (groupBy === "Investigating_Officer") {
    return (response.data as OfficerRankingResponse[]).map((item, index) => ({
      rank: index + 1,
      name: item.officer_name,
      unit: item.rank,
      convictionRate: item.conviction_rate * 100,
      totalCases: item.total_cases,
    }));
  } else {
    return (response.data as StationRankingResponse[]).map((item, index) => ({
      rank: index + 1,
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

// 1. Define the shapes the FRONTEND component expects
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

// 2. Backend response types
interface ChargesheetGroup {
  _id: number; // 1 for chargesheeted, 0 for not
  total_convictions: number;
  total_acquittals: number;
}
interface ChargesheetResponse {
  summary: object;
  by_group: ChargesheetGroup[]; // <-- The array is nested here
}

// 3. Implement the API service function
export const fetchChargesheetComparison = async (): Promise<SankeyData> => {
  const response = await apiClient.get<ChargesheetResponse[]>(
    "/analytics/chargesheet-comparison"
  );

  // --- FIX: Check the nested 'by_group' array ---
  if (!Array.isArray(response.data.by_group)) {
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
