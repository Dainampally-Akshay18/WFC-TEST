/**
 * APP COMPONENT
 * Root component wrapping all providers and routes
 * Sets up React Query, theme system, and routing
 */

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
