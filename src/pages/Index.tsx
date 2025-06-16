
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import LandingPage from '@/components/LandingPage';
import ConfirmationSuccess from '@/components/auth/ConfirmationSuccess';

const Index = () => {
  const { confirmationSuccess, loading, user } = useAuth();

  // Show loading state while checking auth
  if (loading) {
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

  // Show regular landing page
  return <LandingPage />;
};

export default Index;
