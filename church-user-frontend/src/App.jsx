/**
 * APP COMPONENT
 * Root component wrapping all providers and routes
 */

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import { appConfig } from "./config/app.config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: appConfig.cache.queryStaleTime,
      gcTime: appConfig.cache.queryGcTime,
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
          <div className="min-h-screen bg-[#F5F9FF] text-[#0F172A]">
            <AppRoutes />
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
