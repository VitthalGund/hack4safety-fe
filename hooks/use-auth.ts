import { useAuthStore } from "@/lib/auth-store";

/**
 * Custom hook to access auth state and actions.
 * This connects your components to the Zustand store.
 */
export const useAuth = () => {
  const {
    token,
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  } = useAuthStore();

  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};
