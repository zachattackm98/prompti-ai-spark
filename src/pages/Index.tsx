
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import LandingPage from '@/components/LandingPage';
import ConfirmationSuccess from '@/components/auth/ConfirmationSuccess';

const Index = () => {
  const { confirmationSuccess, loading: authLoading, user } = useAuth();
  const { loading: subscriptionLoading } = useSubscription();

  // Determine overall loading state - we need both auth and subscription data (if user exists)
  const isLoading = authLoading || (user && subscriptionLoading);

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

  // Show regular landing page with proper loading coordination
  return <LandingPage />;
};

export default Index;
