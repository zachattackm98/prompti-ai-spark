
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  confirmationSuccess: boolean;
  setConfirmationSuccess: (success: boolean) => void;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('[AUTH] Initializing auth provider');
    console.log('[AUTH] Current URL:', window.location.href);
    console.log('[AUTH] Hash:', window.location.hash);

    // Check for auth hash parameters in URL
    const handleAuthHash = async () => {
      const hash = window.location.hash;
      console.log('[AUTH] Checking hash:', hash);

      if (hash && hash.includes('access_token')) {
        console.log('[AUTH] Found access_token in hash, parsing parameters');
        
        // Parse hash parameters - remove the # and split by &
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const expiresAt = hashParams.get('expires_at');

        console.log('[AUTH] Parsed hash params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          type,
          expiresAt
        });

        if (accessToken && refreshToken && type === 'signup') {
          console.log('[AUTH] Processing signup confirmation from URL hash');
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('[AUTH] Error setting session from hash:', error);
              toast({
                title: "Confirmation Error",
                description: "There was an error confirming your account. Please try signing in.",
                variant: "destructive",
              });
            } else if (data.session) {
              console.log('[AUTH] Signup confirmation successful, user:', data.session.user.email);
              setConfirmationSuccess(true);
              
              toast({
                title: "Account Confirmed!",
                description: "Your account has been successfully confirmed. Welcome!",
              });
              
              // Clean up the URL hash
              console.log('[AUTH] Cleaning up URL hash');
              window.history.replaceState(null, '', window.location.pathname);
              
              // Set a longer delay before redirect to account page
              setTimeout(() => {
                console.log('[AUTH] Redirecting to account page');
                window.location.href = '/account';
              }, 3000);
            }
          } catch (error) {
            console.error('[AUTH] Exception during hash processing:', error);
            toast({
              title: "Confirmation Error",
              description: "There was an error confirming your account. Please try signing in.",
              variant: "destructive",
            });
          }
        } else if (accessToken && refreshToken && type === 'recovery') {
          console.log('[AUTH] Processing password reset from URL hash');
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('[AUTH] Error setting session from recovery hash:', error);
              toast({
                title: "Password Reset Error",
                description: "There was an error with your password reset link. Please try again.",
                variant: "destructive",
              });
            } else if (data.session) {
              console.log('[AUTH] Password reset session established, redirecting to reset page');
              
              // Clean up the URL hash
              window.history.replaceState(null, '', window.location.pathname);
              
              // Redirect to password reset page
              setTimeout(() => {
                window.location.href = '/reset-password';
              }, 100);
            }
          } catch (error) {
            console.error('[AUTH] Exception during recovery hash processing:', error);
            toast({
              title: "Password Reset Error",
              description: "There was an error with your password reset link. Please try again.",
              variant: "destructive",
            });
          }
        }
      }
    };

    // Handle auth hash first
    handleAuthHash();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AUTH] Auth state changed:', event, session?.user?.email || 'no user');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle different auth events
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[AUTH] User signed in successfully');
          if (!confirmationSuccess) {
            // Only redirect if not already handling confirmation
            setTimeout(() => {
              if (window.location.pathname === '/') {
                console.log('[AUTH] Redirecting to account from signin');
                window.location.href = '/account';
              }
            }, 100);
          }
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
  }, [toast, confirmationSuccess]);

  const signUp = async (email: string, password: string, fullName?: string) => {
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

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    console.log('[AUTH] Attempting to sign out');
    
    // Check if we have a valid session before attempting sign out
    if (!session) {
      console.log('[AUTH] No active session, clearing local state');
      setUser(null);
      setSession(null);
      setConfirmationSuccess(false);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[AUTH] Sign out error:', error);
        // If the error is related to an invalid session, clear local state anyway
        if (error.message.includes('session') || error.message.includes('token')) {
          console.log('[AUTH] Session-related error, clearing local state');
          setUser(null);
          setSession(null);
          setConfirmationSuccess(false);
          return { error: null };
        }
      } else {
        console.log('[AUTH] Sign out successful');
      }
      
      return { error };
    } catch (err) {
      console.error('[AUTH] Sign out exception:', err);
      // Clear local state even if sign out fails
      setUser(null);
      setSession(null);
      setConfirmationSuccess(false);
      return { error: null };
    }
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    confirmationSuccess,
    setConfirmationSuccess,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
