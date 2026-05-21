/**
 * APP COMPONENT
 * Root component wrapping all providers and routes
 * Sets up React Query, theme system, and routing
 * Applies theme-aware background colors
 */

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import { appConfig } from "./config/app.config";

// Create React Query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: appConfig.cache.queryStaleTime,
      gcTime: appConfig.cache.queryGcTime, // Updated from cacheTime
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Theme-aware app wrapper
 * Applies background colors based on current theme
 */
function AppContent() {
  const { colors } = useTheme();

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ background: colors.background.primary }}
    >
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
