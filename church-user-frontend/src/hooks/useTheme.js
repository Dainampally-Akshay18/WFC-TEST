/**
 * USE THEME HOOK
 * Custom hook for accessing and managing theme throughout the app
 * Provides theme state, toggle functionality, and theme object
 */

import { useThemeStore } from "../store/themeStore";
import { darkTheme } from "../theme/darkTheme";
import { lightTheme } from "../theme/lightTheme";

export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDarkMode = useThemeStore((state) => state.isDarkMode());
  const isLightMode = useThemeStore((state) => state.isLightMode());

  const themeObject = theme === "dark" ? darkTheme : lightTheme;

  return {
    // State
    theme,
    isDarkMode,
    isLightMode,

    // Actions
    setTheme,
    toggleTheme,

    // Theme configuration
    currentTheme: themeObject,
    colors: themeObject.colors,
    gradients: themeObject.gradients,
    glassmorphism: themeObject.glassmorphism,
    shadows: themeObject.shadows,
    components: themeObject.components,
    spacing: themeObject.spacing,
    borderRadius: themeObject.borderRadius,
  };
};

export default useTheme;
