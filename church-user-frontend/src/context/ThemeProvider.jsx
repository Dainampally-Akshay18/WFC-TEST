/**
 * THEME PROVIDER CONTEXT
 * Wraps app with theme system
 * Manages dark/light mode and applies theme to UI
 */

import { useEffect, createContext } from "react";
import { useThemeStore } from "../store/themeStore";
import { darkTheme } from "../theme/darkTheme";
import { lightTheme } from "../theme/lightTheme";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Get current theme object
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        currentTheme,
        isDark: theme === "dark",
        isLight: theme === "light",
      }}
    >
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-[#05010A]" : "bg-[#F8F5FF]"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useThemeStore((state) => ({
    theme: state.theme,
    isDarkMode: state.isDarkMode(),
    isLightMode: state.isLightMode(),
    toggleTheme: state.toggleTheme,
    setTheme: state.setTheme,
  }));

  const themeObject = context.theme === "dark" ? darkTheme : lightTheme;

  return {
    ...context,
    themeObject,
    colors: themeObject.colors,
    gradients: themeObject.gradients,
    glassmorphism: themeObject.glassmorphism,
    shadows: themeObject.shadows,
  };
};
