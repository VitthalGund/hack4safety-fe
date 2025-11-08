import { useQuery, useMutation } from "@tanstack/react-query"
import apiClient from "./apiClient"

// Auth APIs
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post("/auth/login", credentials)
      localStorage.setItem("authToken", data.token)
      return data
    },
  })
}

export const useAuthMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get("/auth/me")
      return data
    },
    enabled: !!localStorage.getItem("authToken"),
  })
}

// Metadata APIs - cached globally
export const useMetadataFields = () => {
  return useQuery({
    queryKey: ["metadata", "fields"],
    queryFn: async () => {
      const { data } = await apiClient.get("/metadata/fields")
      return data
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Case Search API
export const useCasesSearch = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: ["cases", "search", filters],
    queryFn: async () => {
      const { data } = await apiClient.get("/cases/search", { params: filters })
      return data
    },
    enabled: Object.keys(filters).length > 0,
  })
}

// Case Detail API
export const useCaseDetail = (caseId: string) => {
  return useQuery({
    queryKey: ["cases", caseId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/cases/${caseId}`)
      return data
    },
    enabled: !!caseId,
  })
}

// Accused Profile API
export const useAccusedProfile = (accusedId: string) => {
  return useQuery({
    queryKey: ["accused", accusedId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/accused/${accusedId}`)
      return data
    },
    enabled: !!accusedId,
  })
}

// Accused Network API
export const useAccusedNetwork = (accusedId: string) => {
  return useQuery({
    queryKey: ["accused", accusedId, "network"],
    queryFn: async () => {
      const { data } = await apiClient.get(`/accused/${accusedId}/network`)
      return data
    },
    enabled: !!accusedId,
  })
}

// Analytics APIs
export const useAnalyticsConvictionRate = () => {
  return useQuery({
    queryKey: ["analytics", "conviction-rate"],
    queryFn: async () => {
      const { data } = await apiClient.get("/analytics/conviction-rate")
      return data
    },
  })
}

export const useAnalyticsTrends = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["analytics", "trends", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/analytics/trends", { params })
      return data
    },
  })
}

export const useAnalyticsPerformanceRanking = () => {
  return useQuery({
    queryKey: ["analytics", "performance-ranking"],
    queryFn: async () => {
      const { data } = await apiClient.get("/analytics/performance-ranking")
      return data
    },
  })
}

export const useChargesheetSankey = () => {
  return useQuery({
    queryKey: ["analytics", "chargesheet-comparison"],
    queryFn: async () => {
      const { data } = await apiClient.get("/analytics/chargesheet-comparison")
      return data
    },
  })
}

// Geospatial APIs
export const useGeoHeatmap = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["geo", "heatmap", filters],
    queryFn: async () => {
      const { data } = await apiClient.get("/geo/heatmap", { params: filters })
      return data
    },
  })
}

export const useGeoCases = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["geo", "cases", filters],
    queryFn: async () => {
      const { data } = await apiClient.get("/geo/cases", { params: filters })
      return data
    },
  })
}

// Alerts/Notifications API
export const useAlertsFeed = () => {
  return useQuery({
    queryKey: ["alerts", "feed"],
    queryFn: async () => {
      const { data } = await apiClient.get("/alerts/feed")
      return data
    },
    refetchInterval: 1000 * 60, // Refetch every minute
  })
}

// RAG/AI API
export const useRagQuery = () => {
  return useMutation({
    mutationFn: async (payload: { query: string; context?: any }) => {
      const { data } = await apiClient.post("/rag/query", payload)
      return data
    },
  })
}

// Insights API
export const useInsights = () => {
  return useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      const { data } = await apiClient.get("/insights")
      return data
    },
  })
}
