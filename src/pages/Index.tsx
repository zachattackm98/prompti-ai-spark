
import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import LandingPage from '@/components/LandingPage';
import ConfirmationSuccess from '@/components/auth/ConfirmationSuccess';

const Index = () => {
  const navigate = useNavigate();
  const { confirmationSuccess, loading: authLoading, user } = useAuth();
  const { loading: subscriptionLoading } = useSubscription();

  // Optimized loading state calculation with memoization
  const isLoading = useMemo(() => {
    // Only show loading if auth is actually loading or if we have a user but subscription is loading
    return authLoading || (user && subscriptionLoading);
  }, [authLoading, user, subscriptionLoading]);

  // No auto-redirect - let authenticated users access the landing page

  // Show loading state while checking auth and subscription
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

  // Show landing page for all users (authenticated and unauthenticated)
  return <LandingPage />;
};

export default Index;
