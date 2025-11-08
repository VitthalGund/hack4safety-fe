import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/user";

export enum UserRole {
  ADMIN = "ADMIN",
  SP = "SP",
  SDPO = "SDPO",
  IIC = "IIC",
  COURT_LIAISON = "COURT_LIAISON",
}

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => {
        set({ token, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // This is the key that will be used in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);
