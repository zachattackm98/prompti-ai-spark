import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { useWindowFocus } from "@/hooks/useWindowFocus";
import Index from "./pages/Index";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent automatic refetching on window focus to avoid unnecessary reloads
      refetchOnWindowFocus: false,
      // Keep data fresh for longer to reduce network requests
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppContent = () => {
  useWindowFocus();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/account" element={<Account />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
