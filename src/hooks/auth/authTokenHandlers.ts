
import { supabase } from '@/integrations/supabase/client';
import { navigateToHome, navigateToResetPassword } from '@/utils/navigationUtils';
import { logEnvironmentInfo } from '@/utils/environmentUtils';

export const processTokens = async (
  accessToken: string, 
  refreshToken: string, 
  type: string | null,
  toast: any,
  setConfirmationSuccess: (success: boolean) => void
) => {
  try {
    console.log('[AUTH] Processing tokens with enhanced error handling');
    logEnvironmentInfo();
    
    // Validate tokens before attempting to use them
    if (!accessToken || !refreshToken) {
      console.error('[AUTH] Missing required tokens');
      toast({
        title: "Authentication Error",
        description: "Invalid authentication tokens. Please request a new reset link.",
        variant: "destructive",
      });
      return;
    }

    console.log('[AUTH] Setting session with tokens');
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error('[AUTH] Error setting session:', error);
      
      // Provide specific error messages based on error type
      let errorMessage = "There was an error processing your authentication.";
      
      if (error.message.includes('expired') || error.message.includes('invalid')) {
        errorMessage = "Your authentication link has expired or is invalid. Please request a new one.";
      } else if (error.message.includes('token')) {
        errorMessage = "Invalid authentication token. Please try requesting a new reset link.";
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    if (data.session) {
      console.log('[AUTH] Session established successfully');
      console.log('[AUTH] User:', data.session.user?.email);
      
      if (type === 'signup') {
        console.log('[AUTH] Processing signup confirmation');
        setConfirmationSuccess(true);
        toast({
          title: "Account Confirmed!",
          description: "Your account has been successfully confirmed. Welcome!",
        });
        
        setTimeout(() => {
          console.log('[AUTH] Navigating to home after signup confirmation');
          navigateToHome('instant');
        }, 3000);
      } else if (type === 'recovery') {
        console.log('[AUTH] Processing password reset, user authenticated for reset');
        toast({
          title: "Authentication Successful",
          description: "You can now set your new password.",
        });
        
        // Don't redirect immediately, let the reset page handle it
        setTimeout(() => {
          // Only redirect if we're not already on the reset page
          if (!window.location.pathname.includes('reset-password')) {
            navigateToResetPassword();
          }
        }, 100);
        return;
      } else {
        setTimeout(() => {
          console.log('[AUTH] Navigating to home page');
          navigateToHome('instant');
        }, 100);
      }
    } else {
      console.error('[AUTH] No session created despite successful token processing');
      toast({
        title: "Authentication Error", 
        description: "Failed to establish session. Please try again.",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error('[AUTH] Exception during token processing:', error);
    toast({
      title: "Authentication Error",
      description: "There was an error processing your authentication. Please try again.",
      variant: "destructive",
    });
  }
};

export const processHashAuth = async (
  hash: string,
  toast: any,
  setConfirmationSuccess: (success: boolean) => void
) => {
  const hashParams = new URLSearchParams(hash.substring(1));
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  const type = hashParams.get('type');
  const error = hashParams.get('error');
  const errorDescription = hashParams.get('error_description');

  console.log('[AUTH] Hash params:', { 
    accessToken: accessToken ? 'present' : 'missing',
    refreshToken: refreshToken ? 'present' : 'missing',
    type,
    error,
    errorDescription
  });

  // Check for errors in hash
  if (error) {
    console.error('[AUTH] Error in hash params:', error, errorDescription);
    toast({
      title: "Authentication Error",
      description: errorDescription || "Authentication failed. Please try again.",
      variant: "destructive",
    });
    return;
  }

  if (accessToken && refreshToken) {
    await processTokens(accessToken, refreshToken, type, toast, setConfirmationSuccess);
    // Clean up hash without causing reload
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }
};

export const processUrlAuth = async (
  accessToken: string, 
  refreshToken: string, 
  type: string | null,
  toast: any,
  setConfirmationSuccess: (success: boolean) => void
) => {
  // Check for URL errors
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');

  if (error) {
    console.error('[AUTH] Error in URL params:', error, errorDescription);
    toast({
      title: "Authentication Error",
      description: errorDescription || "Authentication failed. Please try again.",
      variant: "destructive",
    });
    return;
  }

  await processTokens(accessToken, refreshToken, type, toast, setConfirmationSuccess);
  // Clean up URL params without causing reload
  if (window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname);
  }
};
