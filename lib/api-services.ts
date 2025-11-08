import apiClient from "./api-client";

// Define the shape of the data coming from the BACKEND
interface TrendApiResponse {
  year: number;
  month: number;
  total_convictions: number;
  total_acquittals: number;
  total_cases: number;
}

// Define the shape the FRONTEND CHART expects
export interface TrendData {
  date: string; // e.g., "Jan 2024"
  Convicted: number;
  Acquitted: number;
  "Total Cases": number;
}

/**
 * Fetches trends data from the backend and transforms it for the chart.
 */
export const fetchTrends = async (
  period: "monthly" | "yearly"
): Promise<TrendData[]> => {
  // TODO: The backend /analytics/trends endpoint doesn't currently use the 'period' param.
  // We will ignore it for now, but in a real app, you would pass this to the API.
  // Example: const response = await apiClient.get("/analytics/trends", { params: { period } });

  const response = await apiClient.get<TrendApiResponse[]>("/analytics/trends");

  if (!Array.isArray(response.data)) {
    throw new Error("Invalid data format received from server.");
  }

  // --- FIX: Transform backend data into the shape the chart expects ---
  const transformedData: TrendData[] = response.data.map((item) => {
    // Create a date string. JS months are 0-indexed, so -1.
    const date = new Date(item.year, item.month - 1);
    const dateString = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
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

export async function fetchConvictionRate(
  groupBy: string,
  filters?: Record<string, string>
) {
  return apiService.fetchConvictionRate(groupBy, filters);
}

export async function fetchPerformanceRanking(
  entityType: "io" | "pp" | "unit",
  limit = 10
) {
  return apiService.fetchPerformanceRanking(entityType, limit);
}

export async function fetchChargesheetComparison() {
  return apiService.fetchChargesheetComparison();
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
