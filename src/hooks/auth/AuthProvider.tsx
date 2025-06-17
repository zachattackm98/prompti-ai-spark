
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { scrollToTop } from '@/utils/scrollUtils';
import { AuthContext } from './AuthContext';
import { signUp, signIn, signOut, resetPassword, updatePassword } from './authOperations';
import { processHashAuth, processUrlAuth } from './authTokenHandlers';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('[AUTH] Initializing auth provider');
    console.log('[AUTH] Current URL:', window.location.href);
    console.log('[AUTH] Hash:', window.location.hash);
    console.log('[AUTH] Search params:', window.location.search);

    // Check for auth parameters in both hash and URL search params
    const handleAuthParams = async () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      
      // Check hash parameters (legacy)
      if (hash && hash.includes('access_token')) {
        console.log('[AUTH] Found access_token in hash, parsing parameters');
        await processHashAuth(hash, toast, setConfirmationSuccess);
      }
      
      // Check URL search parameters (newer method)
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      
      if (accessToken && refreshToken) {
        console.log('[AUTH] Found tokens in URL params, type:', type);
        await processUrlAuth(accessToken, refreshToken, type, toast, setConfirmationSuccess);
      }
    };

    // Handle auth parameters first
    handleAuthParams();

    // Set up auth state listener - simplified without redundant redirects
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AUTH] Auth state changed:', event, session?.user?.email || 'no user');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[AUTH] User signed in successfully, scrolling to top');
          scrollToTop('smooth');
        } else if (event === 'SIGNED_OUT') {
          console.log('[AUTH] User signed out');
          setConfirmationSuccess(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AUTH] Initial session check:', session?.user?.email || 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleSignOut = async () => {
    const result = await signOut(session);
    if (result.error === null) {
      setUser(null);
      setSession(null);
      setConfirmationSuccess(false);
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
