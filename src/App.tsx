
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth/AuthProvider";
import { SubscriptionProvider } from "@/hooks/subscription/SubscriptionProvider";
import { PromptUsageProvider } from "@/hooks/PromptUsageContext";
import Index from "./pages/Index";
import Account from "./pages/Account";
import Testing from "./pages/Testing";
import Generate from "./pages/Generate";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/auth/AuthPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Optimized React Query configuration to prevent unnecessary refetches
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent refetching on window focus to avoid refresh issues
      refetchOnWindowFocus: false,
      // Reduce refetch frequency for better performance
      refetchOnReconnect: 'always',
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests only once
      retry: 1,
      // Shorter timeout for better UX
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <PromptUsageProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/generate" element={
                  <ProtectedRoute>
                    <Generate />
                  </ProtectedRoute>
                } />
                <Route path="/account" element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } />
                <Route path="/testing" element={
                  <ProtectedRoute>
                    <Testing />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PromptUsageProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
