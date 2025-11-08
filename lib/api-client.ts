import { useAuthStore } from "@/lib/auth-store";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // <-- FIXED
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // <-- Fixed to use useAuthStore
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      console.error("Unauthorized request, logging out.");
      useAuthStore.getState().logout(); // <-- Fixed to use useAuthStore
      // Optionally redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
