
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Track initialization to prevent unnecessary auth param processing
  const isInitializedRef = useRef(false);
  const lastSessionIdRef = useRef<string | null>(null);

  // Memoize auth parameter handler to prevent unnecessary re-renders
  const handleAuthParams = useCallback(async () => {
    // Only process auth params once during initialization
    if (isInitializedRef.current) return;
    
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check hash parameters (legacy)
    if (hash && hash.includes('access_token')) {
      console.log('[AUTH] Found access_token in hash, parsing parameters');
      await processHashAuth(hash, toast, setConfirmationSuccess);
      return;
    }
    
    // Check URL search parameters (newer method)
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    if (accessToken && refreshToken) {
      console.log('[AUTH] Found tokens in URL params, type:', type);
      await processUrlAuth(accessToken, refreshToken, type, toast, setConfirmationSuccess);
    }
  }, [toast]);

  // Optimized auth state change handler - prevent unnecessary updates
  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    const currentSessionId = session?.access_token?.substring(0, 20) || null;
    
    // Skip if this is the same session (prevents duplicate processing)
    if (currentSessionId === lastSessionIdRef.current && isInitializedRef.current) {
      console.log('[AUTH] Same session detected, skipping state change');
      return;
    }

    console.log('[AUTH] Auth state changed:', event, session?.user?.email || 'no user');
    
    // Update refs first
    lastSessionIdRef.current = currentSessionId;
    
    // Update state synchronously to prevent render loops
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);

    // Handle auth events with minimal side effects
    if (event === 'SIGNED_IN' && session?.user) {
      console.log('[AUTH] User signed in successfully');
      // Use setTimeout to defer DOM manipulation and prevent interference
      setTimeout(() => {
        scrollToTop('smooth');
      }, 0);
    } else if (event === 'SIGNED_OUT') {
      console.log('[AUTH] User signed out');
      setConfirmationSuccess(false);
      // Clear session tracking
      lastSessionIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    console.log('[AUTH] Initializing auth provider');
    console.log('[AUTH] Current URL:', window.location.href);

    let mounted = true;

    // Handle auth parameters first (only once)
    if (!isInitializedRef.current) {
      handleAuthParams();
    }

    // Set up auth state listener with proper cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        console.log('[AUTH] Initial session check:', session?.user?.email || 'no session');
        const currentSessionId = session?.access_token?.substring(0, 20) || null;
        lastSessionIdRef.current = currentSessionId;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        isInitializedRef.current = true;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthParams, handleAuthStateChange]);

  const handleSignOut = async () => {
    const result = await signOut(session);
    if (result.error === null) {
      setUser(null);
      setSession(null);
      setConfirmationSuccess(false);
      lastSessionIdRef.current = null;
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
