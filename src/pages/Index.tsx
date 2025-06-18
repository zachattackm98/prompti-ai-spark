
import React, { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import LandingPage from '@/components/LandingPage';
import ConfirmationSuccess from '@/components/auth/ConfirmationSuccess';

const Index = () => {
  const { confirmationSuccess, loading: authLoading, user } = useAuth();
  const { loading: subscriptionLoading } = useSubscription();

  // Memoize loading state calculation to prevent unnecessary re-renders
  const isLoading = useMemo(() => {
    // Only show loading for initial auth check
    if (authLoading && !user) {
      return true;
    }
    
    // For authenticated users, only show loading if subscription is actively loading
    // and we don't have cached data
    if (user && subscriptionLoading) {
      const cachedData = localStorage.getItem('subscription_cache');
      if (cachedData) {
        try {
          const cached = JSON.parse(cachedData);
          const cacheAge = Date.now() - cached.timestamp;
          // Use cache if less than 5 minutes old
          return cacheAge >= 5 * 60 * 1000;
        } catch {
          return true;
        }
      }
      return true;
    }
    
    return false;
  }, [authLoading, subscriptionLoading, user]);

  // Show loading state only when truly necessary
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show confirmation success if user just confirmed their account
  if (confirmationSuccess) {
    return <ConfirmationSuccess />;
  }

  // Show regular landing page with optimized loading coordination
  return <LandingPage />;
};

export default Index;
