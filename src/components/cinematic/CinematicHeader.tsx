
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut, Crown } from 'lucide-react';
import { SubscriptionTier } from '@/types/subscription';

interface CinematicHeaderProps {
  user: any;
  subscription?: { tier: SubscriptionTier };
  onSignOut?: () => void;
  onUpgrade?: () => void;
}

const CinematicHeader: React.FC<CinematicHeaderProps> = ({
  user,
  subscription,
  onSignOut,
  onUpgrade
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-left">
              <p className="text-sm text-gray-400">Welcome back,</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {user && subscription && subscription.tier !== 'studio' && (
            <Button
              onClick={onUpgrade}
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white hover:from-purple-700 hover:to-pink-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
          
          {user && (
            <Button
              onClick={onSignOut}
              variant="outline"
              size="sm"
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
        Cinematic Prompt Generator
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Transform your creative ideas into professional cinematic prompts with AI-powered precision
      </p>
    </motion.div>
  );
};

export default CinematicHeader;
