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
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          // --- FIX: Create form data (URLSearchParams) ---
          const params = new URLSearchParams();
          params.append("username", username);
          params.append("password", password);

          // --- FIX: Send as 'application/x-www-form-urlencoded' ---
          const response = await apiClient.post<{ access_token: string }>(
            "/auth/token",
            params, // Send params as data
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const token = response.data.access_token;
          set({ token, isAuthenticated: true });

          // After setting the token, fetch the user details
          await get().setUser();
          set({ isLoading: false });
        } catch (error: any) {
          console.error("Login failed:", error);
          const detail =
            error.response?.data?.detail || "Invalid username or password.";
          set({ isLoading: false, error: detail });
          // Re-throw the error to be handled by the UI
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
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
          // If we can't get user, log out
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// This re-hydrates the user info on app load if a token is present
export const initializeAuth = () => {
  const { token, user, setUser } = useAuthStore.getState();
  if (token && !user) {
    setUser().catch((error) => {
      console.error("Failed to re-hydrate user on init:", error);
    });
  }
};
