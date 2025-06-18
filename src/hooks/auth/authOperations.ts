
import { supabase } from '@/integrations/supabase/client';

export const signUp = async (email: string, password: string, fullName?: string) => {
  const redirectUrl = `${window.location.origin}/`;
  
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
  const redirectUrl = `${window.location.origin}/reset-password`;
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
  return { error };
};

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({
    password: password
  });
  return { error };
};
