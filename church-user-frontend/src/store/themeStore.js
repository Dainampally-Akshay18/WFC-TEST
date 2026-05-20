/**
 * THEME STORE (Zustand)
 * Manages dark/light mode state globally
 * Persists theme preference to localStorage
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Initial state
      theme: "dark", // "dark" | "light"

      // Actions
      toggleTheme: () => {
        const current = get().theme;
        const newTheme = current === "dark" ? "light" : "dark";
        set({ theme: newTheme });

        // Update document root class for Tailwind dark mode support
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      setTheme: (theme) => {
        set({ theme });

        // Update document root class
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      // Getters
      isDarkMode: () => get().theme === "dark",
      isLightMode: () => get().theme === "light",
    }),
    {
      name: "theme-store", // localStorage key
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);
