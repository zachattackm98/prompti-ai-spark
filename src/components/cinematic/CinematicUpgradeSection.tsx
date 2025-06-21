
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Zap, ArrowRight } from 'lucide-react';

interface CinematicUpgradeSectionProps {
  user: any;
  generatedPrompt: any;
  canUseFeature: (feature: string) => boolean;
  subscription: any;
  onUpgrade: () => void;
}

const CinematicUpgradeSection: React.FC<CinematicUpgradeSectionProps> = ({
  user,
  generatedPrompt,
  canUseFeature,
  subscription,
  onUpgrade
}) => {
  // Only show upgrade prompt for starter users who have generated content
  if (!user || !generatedPrompt || subscription.tier !== 'starter') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-xl p-6 text-center"
    >
      <div className="flex items-center justify-center mb-4">
        <Crown className="w-8 h-8 text-yellow-400 mr-2" />
        <Zap className="w-6 h-6 text-purple-400" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">
        Loving the Results? Get More!
      </h3>
      
      <p className="text-gray-300 mb-4">
        You've experienced the full power of AiPromptMachine! Upgrade to generate up to 500-1000 prompts per month with priority support.
      </p>
      
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300">
          Current: 5 prompts/month
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm text-white font-medium">
          Up to 1000 prompts/month
        </div>
      </div>
      
      <Button
        onClick={onUpgrade}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-medium transition-all duration-200"
      >
        <Crown className="w-4 h-4 mr-2" />
        Upgrade for More Prompts
      </Button>
      
      <p className="text-xs text-gray-400 mt-2">
        All features included • 30-day money-back guarantee
      </p>
    </motion.div>
  );
};

export default CinematicUpgradeSection;
