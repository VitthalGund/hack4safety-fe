import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiClient from "./api-client";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  last_login: string;
}

// Define the UserRole enum to match the backend
export enum UserRole {
  ADMIN = "ADMIN",
  SP = "SP",
  SDPO = "SDPO",
  IIC = "IIC",
  COURT_LIAISON = "COURT_LIAISON",
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: () => Promise<void>;
  clearError: () => void;
  setTokens: (access: string, refresh: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      setTokens: (access: string, refresh: string) => {
        set({ token: access, refreshToken: refresh, isAuthenticated: true });
      },

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const params = new URLSearchParams();
          params.append("username", username);
          params.append("password", password);

          // --- FIX: Expect both tokens from /auth/token ---
          const response = await apiClient.post<{
            access_token: string;
            refresh_token: string;
          }>("/auth/token", params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });

          const { access_token, refresh_token } = response.data;

          // --- FIX: Use new setTokens action ---
          set({
            token: access_token,
            refreshToken: refresh_token,
            isAuthenticated: true,
          });

          await get().setUser();
          set({ isLoading: false });
        } catch (error: any) {
          console.error("Login failed:", error);
          const detail =
            error.response?.data?.detail || "Invalid username or password.";
          set({ isLoading: false, error: detail });
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          refreshToken: null, // <-- FIX: Clear refresh token
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      },

      setUser: async () => {
        if (!get().token) {
          console.error("setUser called without a token.");
          return;
        }
        try {
          const response = await apiClient.get<User>("/auth/users/me");
          set({ user: response.data });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Don't log out here, the interceptor will handle it
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const initializeAuth = () => {
  const { token, user, setUser } = useAuthStore.getState();
  if (token && !user) {
    setUser().catch((error) => {
      console.error("Failed to re-hydrate user on init:", error);
    });
  }
};
