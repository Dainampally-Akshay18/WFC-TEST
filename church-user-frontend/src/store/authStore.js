/**
 * AUTH STORE (Zustand)
 * Manages global authentication state
 * Persists to localStorage for session continuity
 * Handles user info, tokens, and auth status
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // ===== SETTERS =====

      /**
       * Set user data
       */
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      /**
       * Set authentication token
       */
      setToken: (token) => set({ token }),

      /**
       * Set loading state
       */
      setLoading: (loading) => set({ loading }),

      /**
       * Set error message
       */
      setError: (error) => set({ error }),

      /**
       * Clear error message
       */
      clearError: () => set({ error: null }),

      // ===== ACTIONS =====

      /**
       * Login user
       * Called after successful login API response
       */
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
          loading: false,
        });
      },

      /**
       * Logout user
       * Clears all auth state and localStorage
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
      },

      /**
       * Update user profile
       * Called after profile update API response
       */
      updateUser: (updates) => {
        const current = get().user;
        if (current) {
          set({
            user: {
              ...current,
              ...updates,
            },
          });
        }
      },
    }),
    {
      name: "auth-store", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
