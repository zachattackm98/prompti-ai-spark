
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { logEnvironmentInfo, getBaseUrl } from '@/utils/environmentUtils';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const [errorType, setErrorType] = useState<'expired' | 'invalid' | 'network' | null>(null);
  
  const { updatePassword, user, session, resetPassword } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log('[RESET] Initializing password reset page');
    logEnvironmentInfo();
    
    // Check URL parameters for reset tokens
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
    const type = urlParams.get('type') || hashParams.get('type');
    const error = urlParams.get('error') || hashParams.get('error');
    const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
    
    console.log('[RESET] URL analysis:', { 
      accessToken: accessToken ? 'present' : 'missing',
      refreshToken: refreshToken ? 'present' : 'missing',
      type,
      error,
      errorDescription,
      currentUrl: window.location.href,
      baseUrl: getBaseUrl()
    });

    // Check for URL errors first
    if (error) {
      console.log('[RESET] Error in URL parameters:', error, errorDescription);
      if (error === 'access_denied' || errorDescription?.includes('token')) {
        setErrorType('expired');
      } else {
        setErrorType('invalid');
      }
      setValidSession(false);
      return;
    }
    
    // Give time for auth to process tokens and establish session
    const sessionCheckTimer = setTimeout(() => {
      console.log('[RESET] Checking session after delay');
      console.log('[RESET] Current user:', user?.email || 'none');
      console.log('[RESET] Current session:', session ? 'present' : 'none');
      
      if (!session || !user) {
        console.log('[RESET] No valid session found');
        // Determine error type based on URL params
        if (accessToken && refreshToken) {
          setErrorType('expired'); // Tokens were present but didn't work
        } else {
          setErrorType('invalid'); // No tokens at all
        }
        setValidSession(false);
      } else {
        console.log('[RESET] Valid session confirmed');
        setValidSession(true);
      }
    }, 3000); // Increased wait time for token processing

    return () => clearTimeout(sessionCheckTimer);
  }, [session, user]);

  const handleRequestNewLink = async () => {
    const email = prompt('Please enter your email address to receive a new reset link:');
    if (!email) return;

    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "New Reset Link Sent",
          description: "Please check your email for a new password reset link.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('[RESET] Attempting to update password');
      const result = await updatePassword(password);

      if (result.error) {
        console.error('[RESET] Password update error:', result.error);
        
        // Handle specific error types
        if (result.error.message.includes('session') || result.error.message.includes('token')) {
          setErrorType('expired');
          setValidSession(false);
        } else {
          toast({
            title: "Error",
            description: result.error.message,
            variant: "destructive",
          });
        }
      } else {
        console.log('[RESET] Password updated successfully');
        setSuccess(true);
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated.",
        });
        
        setTimeout(() => {
          const accountUrl = `${getBaseUrl()}/account`;
          console.log('[RESET] Redirecting to account:', accountUrl);
          window.location.href = accountUrl;
        }, 3000);
      }
    } catch (error: any) {
      console.error('[RESET] Password update exception:', error);
      
      if (error.message?.includes('session') || error.message?.includes('token')) {
        setErrorType('expired');
        setValidSession(false);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to update password",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking session validity
  if (validSession === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-900/60 border-white/10 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Verifying Reset Link...
            </h1>
            <p className="text-gray-400">
              Please wait while we verify your password reset link.
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show error if no valid session
  if (validSession === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-900/60 border-white/10 p-8 text-center">
            <div className="flex justify-center mb-6">
              <AlertCircle className="w-16 h-16 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {errorType === 'expired' ? 'Reset Link Expired' : 'Invalid Reset Link'}
            </h1>
            <p className="text-gray-400 mb-6">
              {errorType === 'expired' 
                ? 'Your password reset link has expired. Reset links are only valid for a short time for security reasons.'
                : 'Your password reset link is invalid or has already been used. Please request a new one.'
              }
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleRequestNewLink}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Request New Reset Link'
                )}
              </Button>
              <Button
                onClick={() => window.location.href = getBaseUrl()}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show success page
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-900/60 border-white/10 p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Password Updated!
            </h1>
            <p className="text-gray-400 mb-6">
              Your password has been successfully updated. You'll be redirected to your account in a few seconds.
            </p>
            <Button
              onClick={() => window.location.href = `${getBaseUrl()}/account`}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Go to Account
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show password reset form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-900/60 border-white/10 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Set New Password
            </h1>
            <p className="text-gray-400">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white flex items-center gap-2">
                <Lock className="w-4 h-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-white/20 text-white placeholder:text-gray-400 pr-10"
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-800 border-white/20 text-white placeholder:text-gray-400 pr-10"
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
