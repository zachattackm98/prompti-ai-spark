
import { useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { scrollToTop } from '@/utils/scrollUtils';

interface AuthStateHandlerProps {
  updateAuthState: (session: Session | null, user?: any) => void;
  resetAuthState: () => void;
  shouldSkipProcessing: (url: string, sessionId: string | null) => boolean;
  markAsProcessed: (url: string, sessionId: string | null) => void;
}

export const useAuthStateHandler = ({
  updateAuthState,
  resetAuthState,
  shouldSkipProcessing,
  markAsProcessed
}: AuthStateHandlerProps) => {
  
  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    const currentSessionId = session?.access_token?.substring(0, 20) || null;
    const currentUrl = window.location.href;
    
    // Skip if this is the same session (prevents duplicate processing)
    if (shouldSkipProcessing(currentUrl, currentSessionId)) {
      console.log('[AUTH] Same session detected, skipping state change');
      return;
    }

    console.log('[AUTH] Auth state changed:', event, session?.user?.email || 'no user');
    
    // Update refs first
    markAsProcessed(currentUrl, currentSessionId);
    
    // Update state synchronously to prevent render loops
    updateAuthState(session);

    // Handle auth events with minimal side effects
    if (event === 'SIGNED_IN' && session?.user) {
      console.log('[AUTH] User signed in successfully');
      // Use setTimeout to defer DOM manipulation and prevent interference
      setTimeout(() => {
        scrollToTop('smooth');
      }, 0);
    } else if (event === 'SIGNED_OUT') {
      console.log('[AUTH] User signed out');
      resetAuthState();
    }
  }, [updateAuthState, resetAuthState, shouldSkipProcessing, markAsProcessed]);

  return { handleAuthStateChange };
};
