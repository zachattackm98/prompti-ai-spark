
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
    console.log('[AUTH] Search params:', window.location.search);

    // Check for auth parameters in both hash and URL search params
    const handleAuthParams = async () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      
      // Check hash parameters (legacy)
      if (hash && hash.includes('access_token')) {
        console.log('[AUTH] Found access_token in hash, parsing parameters');
        await processHashAuth(hash);
      }
      
      // Check URL search parameters (newer method)
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      
      if (accessToken && refreshToken) {
        console.log('[AUTH] Found tokens in URL params, type:', type);
        await processUrlAuth(accessToken, refreshToken, type);
      }
    };

    const processHashAuth = async (hash: string) => {
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
        await processTokens(accessToken, refreshToken, type);
        // Clean up hash
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    const processUrlAuth = async (accessToken: string, refreshToken: string, type: string | null) => {
      await processTokens(accessToken, refreshToken, type);
      // Clean up URL params
      window.history.replaceState(null, '', window.location.pathname);
    };

    const processTokens = async (accessToken: string, refreshToken: string, type: string | null) => {
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
            
            setTimeout(() => {
              console.log('[AUTH] Redirecting to account page');
              window.location.href = '/account';
            }, 3000);
          } else if (type === 'recovery') {
            console.log('[AUTH] Processing password reset, redirecting to reset page');
            toast({
              title: "Password Reset",
              description: "Please set your new password.",
            });
            
            setTimeout(() => {
              window.location.href = '/reset-password';
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

    // Handle auth parameters first
    handleAuthParams();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AUTH] Auth state changed:', event, session?.user?.email || 'no user');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[AUTH] User signed in successfully');
          if (!confirmationSuccess && window.location.pathname === '/') {
            setTimeout(() => {
              console.log('[AUTH] Redirecting to account from signin');
              window.location.href = '/account';
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
