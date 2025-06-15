
import React from 'react';
import AccountPage from '@/components/account/AccountPage';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Account = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AccountPage />
    </div>
  );
};

export default Account;
