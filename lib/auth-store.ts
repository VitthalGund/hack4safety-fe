import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/user";

export enum UserRole {
  ADMIN = "ADMIN",
  SP = "SP",
  SDPO = "SDPO",
  IIC = "IIC",
  COURT_LIAISON = "COURT_LIAISON",
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      login: (data) => {
        set({
          isAuthenticated: true,
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      },
      setTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
