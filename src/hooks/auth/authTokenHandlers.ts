
import { supabase } from '@/integrations/supabase/client';
import { navigateToHome, navigateToResetPassword } from '@/utils/navigationUtils';

export const processTokens = async (
  accessToken: string, 
  refreshToken: string, 
  type: string | null,
  toast: any,
  setConfirmationSuccess: (success: boolean) => void
) => {
  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error('[AUTH] Error setting session:', error);
      toast({
        title: "Authentication Error",
        description: "There was an error processing your authentication. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (data.session) {
      console.log('[AUTH] Session established successfully');
      
      if (type === 'signup') {
        console.log('[AUTH] Processing signup confirmation');
        setConfirmationSuccess(true);
        toast({
          title: "Account Confirmed!",
          description: "Your account has been successfully confirmed. Welcome!",
        });
        
        // Use navigation utility instead of hard redirect
        setTimeout(() => {
          console.log('[AUTH] Navigating to home after signup confirmation');
          navigateToHome('instant');
        }, 3000);
      } else if (type === 'recovery') {
        console.log('[AUTH] Processing password reset, navigating to reset page');
        toast({
          title: "Password Reset",
          description: "Please set your new password.",
        });
        
        setTimeout(() => {
          navigateToResetPassword();
        }, 100);
        return; // Exit early for password reset
      } else {
        // Single navigation point for other successful auth
        setTimeout(() => {
          console.log('[AUTH] Navigating to home page');
          navigateToHome('instant');
        }, 100);
      }
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

  console.log('[AUTH] Hash params:', { 
    accessToken: accessToken ? 'present' : 'missing',
    refreshToken: refreshToken ? 'present' : 'missing',
    type 
  });

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
  await processTokens(accessToken, refreshToken, type, toast, setConfirmationSuccess);
  // Clean up URL params without causing reload
  if (window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname);
  }
};
