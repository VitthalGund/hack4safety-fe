import { useAuthStore } from "@/lib/auth-store";
import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- FIX: Add full response interceptor for 401 errors ---

// A variable to prevent multiple concurrent refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Check if it's a 401 error and not a refresh token request
    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/auth/refresh"
    ) {
      // If we are already refreshing, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;
      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        console.error("No refresh token available, logging out.");
        logout();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post<{
          access_token: string;
          refresh_token: string;
        }>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          {}, // Refresh endpoint doesn't need a body, just the header
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { access_token, refresh_token } = refreshResponse.data;
        setTokens(access_token, refresh_token); // Store new tokens

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        processQueue(null, access_token); // Process queued requests
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error("Refresh token failed:", refreshError);
        processQueue(refreshError as AxiosError, null);
        logout(); // Refresh failed, log out
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For all other errors, just reject
    return Promise.reject(error);
  }
);

export default apiClient;
