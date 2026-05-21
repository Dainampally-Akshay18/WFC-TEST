/**
 * THEME PROVIDER CONTEXT
 * Wraps app with centralized theme system
 * Manages dark/light mode and theme-driven UI
 * 
 * Provides:
 * - isDarkMode / isLightMode flags
 * - toggleTheme() and setTheme(theme) actions
 * - colors: centralized color palette
 * - glassmorphism: frosted glass effects
 * - shadows: shadow system
 * - gradients: gradient definitions
 */

import { useEffect, createContext, useContext } from "react";
import { useThemeStore } from "../store/themeStore";
import { darkTheme } from "../theme/darkTheme";
import { lightTheme } from "../theme/lightTheme";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Get current theme object
  const isDarkMode = theme === "dark";
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [isDarkMode]);

  const themeContextValue = {
    theme,
    isDarkMode,
    isLightMode: !isDarkMode,
    toggleTheme,
    setTheme,
    currentTheme,
    colors: currentTheme.colors,
    gradients: currentTheme.gradients,
    glassmorphism: currentTheme.glassmorphism,
    shadows: currentTheme.shadows,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
