
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  
  const { updatePassword, user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log('[RESET] Checking session validity');
    console.log('[RESET] User:', user?.email || 'no user');
    console.log('[RESET] Session:', session ? 'present' : 'not present');
    
    // Give some time for auth to initialize
    const timer = setTimeout(() => {
      if (!session || !user) {
        console.log('[RESET] No valid session found, marking as invalid');
        setValidSession(false);
      } else {
        console.log('[RESET] Valid session found');
        setValidSession(true);
      }
    }, 2000); // Wait 2 seconds for auth to initialize

    return () => clearTimeout(timer);
  }, [session, user]);

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
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        console.log('[RESET] Password updated successfully');
        setSuccess(true);
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated.",
        });
        
        setTimeout(() => {
          window.location.href = '/account';
        }, 3000);
      }
    } catch (error: any) {
      console.error('[RESET] Password update exception:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
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
              Loading...
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
              Invalid Reset Link
            </h1>
            <p className="text-gray-400 mb-6">
              Your password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Back to Home
            </Button>
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
              onClick={() => window.location.href = '/account'}
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
