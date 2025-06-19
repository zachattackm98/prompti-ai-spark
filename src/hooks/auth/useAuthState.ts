
import { useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  
  // Track last processed URL and session to prevent duplicate processing
  const lastProcessedUrlRef = useRef<string>('');
  const lastSessionIdRef = useRef<string | null>(null);

  const updateAuthState = useCallback((newSession: Session | null, newUser: User | null = null) => {
    setSession(newSession);
    setUser(newUser ?? newSession?.user ?? null);
    setLoading(false);
  }, []);

  const resetAuthState = useCallback(() => {
    setUser(null);
    setSession(null);
    setConfirmationSuccess(false);
    lastSessionIdRef.current = null;
    lastProcessedUrlRef.current = '';
  }, []);

  const shouldSkipProcessing = useCallback((url: string, sessionId: string | null) => {
    return url === lastProcessedUrlRef.current || 
           (sessionId === lastSessionIdRef.current && sessionId !== null);
  }, []);

  const markAsProcessed = useCallback((url: string, sessionId: string | null) => {
    lastProcessedUrlRef.current = url;
    lastSessionIdRef.current = sessionId;
  }, []);

  return {
    user,
    session,
    loading,
    confirmationSuccess,
    setConfirmationSuccess,
    updateAuthState,
    resetAuthState,
    shouldSkipProcessing,
    markAsProcessed,
    lastProcessedUrlRef,
    lastSessionIdRef
  };
};
