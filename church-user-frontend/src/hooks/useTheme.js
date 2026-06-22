/**
 * USE THEME HOOK
 * Custom hook for accessing theme via Zustand store
 * Light mode only — kept for backward compatibility
 */

import { lightTheme } from "../theme/lightTheme";

export const useTheme = () => {
  return {
    theme: "light",
    isDarkMode: false,
    isLightMode: true,
    currentTheme: lightTheme,
    colors: lightTheme.colors,
    gradients: lightTheme.gradients,
    glassmorphism: lightTheme.glassmorphism,
    shadows: lightTheme.shadows,
    components: lightTheme.components,
    spacing: lightTheme.spacing,
    borderRadius: lightTheme.borderRadius,
  };
};

export default useTheme;
