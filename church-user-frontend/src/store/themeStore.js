/**
 * THEME STORE (Zustand)
 * Manages theme state - Light mode only
 * Simplified for single-theme support
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Initial state - Light mode only
      theme: "light",

      // Actions
      setTheme: (theme) => {
        // Only light mode is supported
        set({ theme: "light" });
      },

      // Getters
      isDarkMode: () => false,
      isLightMode: () => true,
    }),
    {
      name: "theme-store", // localStorage key
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
