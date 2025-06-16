
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConfirmationSuccess = () => {
  const handleGoToAccount = () => {
    window.location.href = '/account';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-900/60 border-white/10 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Account Confirmed!
          </h1>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            Your account has been successfully confirmed. Welcome to AiPromptMachine! 
            You'll be redirected to your account page shortly.
          </p>
          
          <Button
            onClick={handleGoToAccount}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Go to Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <div className="mt-4 text-sm text-gray-400">
            Redirecting automatically in a few seconds...
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConfirmationSuccess;
