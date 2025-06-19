
import React, { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './AuthContext';
import { signUp, signIn, signOut, resetPassword, updatePassword } from './authOperations';
import { useAuthState } from './useAuthState';
import { useAuthStateHandler } from './useAuthStateHandler';
import { useAuthUrlHandler } from './useAuthUrlHandler';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user,
    session,
    loading,
    confirmationSuccess,
    setConfirmationSuccess,
    updateAuthState,
    resetAuthState,
    shouldSkipProcessing,
    markAsProcessed
  } = useAuthState();

  const { handleAuthStateChange } = useAuthStateHandler({
    updateAuthState,
    resetAuthState,
    shouldSkipProcessing,
    markAsProcessed
  });

  const { handleAuthParams } = useAuthUrlHandler({
    setConfirmationSuccess,
    shouldSkipProcessing,
    markAsProcessed
  });

  useEffect(() => {
    console.log('[AUTH] Initializing auth provider');
    console.log('[AUTH] Current URL:', window.location.href);

    let mounted = true;

    // Always check for auth parameters in the URL
    handleAuthParams();

    // Set up auth state listener with proper cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        console.log('[AUTH] Initial session check:', session?.user?.email || 'no session');
        const currentSessionId = session?.access_token?.substring(0, 20) || null;
        markAsProcessed(window.location.href, currentSessionId);
        updateAuthState(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthParams, handleAuthStateChange, updateAuthState, markAsProcessed]);

  const handleSignOut = async () => {
    const result = await signOut(session);
    if (result.error === null) {
      resetAuthState();
    }
    return result;
  };

  const value = {
    user,
    session,
    loading,
    confirmationSuccess,
    setConfirmationSuccess,
    signUp,
    signIn,
    signOut: handleSignOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
