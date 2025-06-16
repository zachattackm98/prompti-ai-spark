
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { SubscriptionTier } from '@/types/subscription';
import { useSubscription } from '@/hooks/useSubscription';

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
  currentTier
}) => {
  const { createCheckout, loading } = useSubscription();
  const [error, setError] = React.useState<string | null>(null);

  const handleUpgrade = async () => {
    if (requiredTier === 'creator' || requiredTier === 'studio') {
      console.log('[UPGRADE] Starting upgrade process for tier:', requiredTier);
      setError(null);
      
      try {
        await createCheckout(requiredTier);
      } catch (error: any) {
        console.error('[UPGRADE] Upgrade failed:', error);
        setError(error.message || 'Failed to start upgrade process');
      }
    }
  };

  const isUpgrade = currentTier !== 'starter' && currentTier !== requiredTier;

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
        {isUpgrade ? 'Upgrade' : 'Subscribe'} to <span className={`font-semibold bg-gradient-to-r ${tierColors[requiredTier]} bg-clip-text text-transparent`}>
          {tierNames[requiredTier]}
        </span> to unlock this feature and enhance your cinematic prompts.
      </p>
      
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300">
          Current: {tierNames[currentTier]}
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <div className={`px-3 py-1 bg-gradient-to-r ${tierColors[requiredTier]} rounded-full text-sm text-white font-medium`}>
          {isUpgrade ? 'Upgrade to' : 'Get'} {tierNames[requiredTier]}
        </div>
      </div>

      {isUpgrade && (
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            Your current {tierNames[currentTier]} subscription will be automatically cancelled and you'll receive credit for unused time.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-400/30 rounded-lg">
          <div className="flex items-center justify-center text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        </div>
      )}
      
      <Button
        onClick={handleUpgrade}
        disabled={loading}
        className={`bg-gradient-to-r ${tierColors[requiredTier]} hover:opacity-90 text-white font-medium transition-all duration-200`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="w-4 h-4 mr-2" />
            {isUpgrade ? 'Upgrade Now' : 'Subscribe Now'}
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default UpgradePrompt;
