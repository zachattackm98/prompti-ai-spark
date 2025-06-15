
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';
import { SubscriptionTier } from '@/types/subscription';

interface UpgradePromptProps {
  feature: string;
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
  onUpgrade?: () => void;
}

const tierNames = {
  starter: 'Starter',
  creator: 'Creator',
  studio: 'Studio'
};

const tierColors = {
  starter: 'from-gray-500 to-gray-600',
  creator: 'from-purple-500 to-pink-500',
  studio: 'from-yellow-500 to-orange-500'
};

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  requiredTier,
  currentTier,
  onUpgrade
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-900/90 to-purple-900/30 border border-purple-400/30 rounded-xl p-6 text-center"
    >
      <div className="flex items-center justify-center mb-4">
        <Crown className="w-8 h-8 text-yellow-400 mr-2" />
        <Sparkles className="w-6 h-6 text-purple-400" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">
        {feature} is a Premium Feature
      </h3>
      
      <p className="text-gray-300 mb-4">
        Upgrade to <span className={`font-semibold bg-gradient-to-r ${tierColors[requiredTier]} bg-clip-text text-transparent`}>
          {tierNames[requiredTier]}
        </span> to unlock this feature and enhance your cinematic prompts.
      </p>
      
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300">
          Current: {tierNames[currentTier]}
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <div className={`px-3 py-1 bg-gradient-to-r ${tierColors[requiredTier]} rounded-full text-sm text-white font-medium`}>
          Upgrade to {tierNames[requiredTier]}
        </div>
      </div>
      
      <Button
        onClick={onUpgrade}
        className={`bg-gradient-to-r ${tierColors[requiredTier]} hover:opacity-90 text-white font-medium`}
      >
        <Crown className="w-4 h-4 mr-2" />
        Upgrade Now
      </Button>
    </motion.div>
  );
};

export default UpgradePrompt;
