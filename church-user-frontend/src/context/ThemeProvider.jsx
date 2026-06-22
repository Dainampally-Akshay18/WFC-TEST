/**
 * THEME PROVIDER CONTEXT
 * Wraps app with centralized theme system
 * Single professional light theme
 */

import { createContext, useContext } from "react";
import { lightTheme } from "../theme/lightTheme";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const currentTheme = lightTheme;

  const themeContextValue = {
    theme: "light",
    isDarkMode: false,
    isLightMode: true,
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
