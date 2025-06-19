
import { useCallback } from 'react';
import { processHashAuth, processUrlAuth } from './authTokenHandlers';
import { useToast } from '@/hooks/use-toast';

interface AuthUrlHandlerProps {
  setConfirmationSuccess: (success: boolean) => void;
  shouldSkipProcessing: (url: string, sessionId: string | null) => boolean;
  markAsProcessed: (url: string, sessionId: string | null) => void;
}

export const useAuthUrlHandler = ({
  setConfirmationSuccess,
  shouldSkipProcessing,
  markAsProcessed
}: AuthUrlHandlerProps) => {
  const { toast } = useToast();

  const handleAuthParams = useCallback(async () => {
    const currentUrl = window.location.href;
    
    // Skip if we've already processed this exact URL
    if (shouldSkipProcessing(currentUrl, null)) {
      console.log('[AUTH] URL already processed, skipping');
      return;
    }
    
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check hash parameters (legacy)
    if (hash && hash.includes('access_token')) {
      console.log('[AUTH] Found access_token in hash, parsing parameters');
      markAsProcessed(currentUrl, null);
      await processHashAuth(hash, toast, setConfirmationSuccess);
      return;
    }
    
    // Check URL search parameters (newer method)
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    if (accessToken && refreshToken) {
      console.log('[AUTH] Found tokens in URL params, type:', type);
      markAsProcessed(currentUrl, null);
      await processUrlAuth(accessToken, refreshToken, type, toast, setConfirmationSuccess);
    }
  }, [toast, setConfirmationSuccess, shouldSkipProcessing, markAsProcessed]);

  return { handleAuthParams };
};
