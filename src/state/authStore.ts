import { create } from "zustand"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "sp" | "dgp" | "judge" | "lawyer" | "io" | "liaison"
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem("authToken")
    set({ user: null, isAuthenticated: false })
  },
}))
