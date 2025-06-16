
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToAuth: () => void;
}

const ForgotPasswordDialog = ({ open, onOpenChange, onBackToAuth }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setEmailSent(true);
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    setLoading(false);
    onOpenChange(false);
  };

  const handleBackToAuth = () => {
    handleClose();
    onBackToAuth();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-900/95 border-white/10 text-white">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl font-bold">
            {emailSent ? 'Email Sent!' : 'Reset Your Password'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {emailSent 
              ? 'We\'ve sent password reset instructions to your email address.' 
              : 'Enter your email address and we\'ll send you a link to reset your password.'
            }
          </DialogDescription>
        </DialogHeader>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Enter your email address"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className="mt-6 text-center">
            <div className="mb-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">
                If an account with that email exists, you'll receive password reset instructions shortly.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Close
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={handleBackToAuth}
            className="text-purple-400 hover:text-purple-300 p-0 h-auto font-medium flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
