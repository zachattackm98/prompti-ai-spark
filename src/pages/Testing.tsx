
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionTestDashboard from '@/components/testing/SubscriptionTestDashboard';
import AuthPage from '@/components/auth/AuthPage';

const Testing = () => {
  const { user } = useAuth();

  // Show auth page if not logged in, otherwise show test dashboard
  return user ? <SubscriptionTestDashboard /> : <AuthPage />;
};

export default Testing;
