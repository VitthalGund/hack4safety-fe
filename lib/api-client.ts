import axios from "axios";
import { useAuthStore } from "./auth-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    // Read directly from localStorage.
    // This is more robust against hydration timing issues.
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch (e) {
      console.error("Could not parse auth-storage from localStorage", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors, e.g., by logging out
      useAuthStore.getState().logout();
      // Optionally redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
