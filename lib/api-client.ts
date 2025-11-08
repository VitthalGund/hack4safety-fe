// lib/api-client.ts

import axios from "axios";
import { useAuthStore } from "./auth-store";
import { refreshAccessToken } from "./api-services"; // <-- THIS IS THE LINE YOU ASKED FOR

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    console.log({ accessToken });
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, logout, setTokens } = useAuthStore.getState();

    // Check for 401 Unauthorized and ensure it's not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
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

      originalRequest._retry = true;
      isRefreshing = true;

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const response = await refreshAccessToken(refreshToken);
        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          response.data;

        // Update the store with new tokens
        setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        // Update the header of the original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Process the queue with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        return apiClient(originalRequest); // <-- Use apiClient here
      } catch (refreshError) {
        // If refresh fails, log out and reject all
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
