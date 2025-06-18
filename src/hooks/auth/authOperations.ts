
import { supabase } from '@/integrations/supabase/client';
import { getAuthRedirectUrl, logEnvironmentInfo } from '@/utils/environmentUtils';

export const signUp = async (email: string, password: string, fullName?: string) => {
  logEnvironmentInfo();
  
  const redirectUrl = getAuthRedirectUrl('/');
  console.log('[AUTH] SignUp redirect URL:', redirectUrl);
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: fullName ? { full_name: fullName } : undefined
    }
  });
  return { error };
};

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error };
};

export const signOut = async (session: any) => {
  console.log('[AUTH] Attempting to sign out');
  
  if (!session) {
    console.log('[AUTH] No active session, clearing local state');
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[AUTH] Sign out error:', error);
      if (error.message.includes('session') || error.message.includes('token')) {
        console.log('[AUTH] Session-related error, clearing local state');
        return { error: null };
      }
    } else {
      console.log('[AUTH] Sign out successful');
    }
    
    return { error };
  } catch (err) {
    console.error('[AUTH] Sign out exception:', err);
    return { error: null };
  }
};

export const resetPassword = async (email: string) => {
  logEnvironmentInfo();
  
  const redirectUrl = getAuthRedirectUrl('/reset-password');
  console.log('[AUTH] Password reset redirect URL:', redirectUrl);
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('[AUTH] Reset password error:', error);
    } else {
      console.log('[AUTH] Reset password email sent successfully');
    }
    
    return { error };
  } catch (err: any) {
    console.error('[AUTH] Reset password exception:', err);
    return { error: err };
  }
};

export const updatePassword = async (password: string) => {
  try {
    console.log('[AUTH] Attempting to update password');
    
    // First check if we have a valid session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('[AUTH] Session error before password update:', sessionError);
      return { error: sessionError };
    }
    
    if (!sessionData.session) {
      console.error('[AUTH] No active session for password update');
      return { error: new Error('No active session. Please use the reset link again.') };
    }
    
    console.log('[AUTH] Valid session found, proceeding with password update');
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      console.error('[AUTH] Password update error:', error);
    } else {
      console.log('[AUTH] Password updated successfully');
    }
    
    return { error };
  } catch (err: any) {
    console.error('[AUTH] Password update exception:', err);
    return { error: err };
  }
};
