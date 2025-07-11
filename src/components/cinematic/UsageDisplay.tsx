
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, AlertCircle, TrendingUp } from 'lucide-react';
import { usePromptUsage } from '@/hooks/usePromptUsage';
import { useSubscription } from '@/hooks/useSubscription';
import { useIsMobile } from '@/hooks/use-mobile';

interface UsageDisplayProps {
  onUpgrade?: () => void;
}

const UsageDisplay = ({ onUpgrade }: UsageDisplayProps) => {
  const { subscription } = useSubscription();
  const isMobile = useIsMobile();
  const { 
    usage, 
    loading, 
    remainingPrompts, 
    hasReachedLimit, 
    usagePercentage, 
    promptLimit
  } = usePromptUsage();

  const tierConfig = {
    starter: {
      name: 'Starter Plan',
      color: 'border-purple-400/50 text-purple-300',
      border: 'border-purple-500/20'
    },
    creator: {
      name: 'Creator Plan',
      color: 'border-blue-400/50 text-blue-300',
      border: 'border-blue-500/20'
    },
    studio: {
      name: 'Studio Plan',
      color: 'border-yellow-400/50 text-yellow-300',
      border: 'border-yellow-500/20'
    }
  };

  const config = tierConfig[subscription.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className={`border ${config.border} p-4 backdrop-blur-sm bg-transparent`}>
        {/* Header - Mobile optimized */}
        <div className={`flex items-center justify-between mb-3 ${isMobile ? 'flex-col gap-2' : ''}`}>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`border-opacity-50 ${config.color} text-xs`}>
              {config.name}
            </Badge>
            {hasReachedLimit && (
              <AlertCircle className="w-4 h-4 text-orange-400" />
            )}
          </div>
          {onUpgrade && subscription.tier !== 'studio' && (
            <Button
              onClick={onUpgrade}
              size="sm"
              className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white ${
                isMobile ? 'w-full min-h-[40px]' : ''
              }`}
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {/* Usage stats - Mobile friendly */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300 text-xs sm:text-sm">Monthly Prompts Used</span>
            <span className="text-white font-medium text-sm">
              {loading ? '...' : `${usage?.prompt_count || 0}/${promptLimit}`}
            </span>
          </div>

          <Progress value={usagePercentage} className="h-2" />

          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${hasReachedLimit ? 'text-orange-400' : 'text-gray-400'}`}>
              {hasReachedLimit ? (
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Limit reached</span>
                </div>
              ) : (
                `${remainingPrompts} prompts remaining`
              )}
            </span>
            <span className="text-gray-500">
              Resets monthly
            </span>
          </div>

          {/* Upgrade prompt - Mobile optimized */}
          {hasReachedLimit && (
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <div className="flex items-center gap-2 text-sm text-orange-300 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Ready to create more?</span>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {subscription.tier === 'starter' && 'Upgrade to Creator (500/month) or Studio (1000/month) for more prompts.'}
                {subscription.tier === 'creator' && 'Upgrade to Studio plan for 1000 prompts per month.'}
                {subscription.tier === 'studio' && 'Your usage will reset next month.'}
              </p>
              {onUpgrade && subscription.tier !== 'studio' && (
                <Button
                  onClick={onUpgrade}
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white min-h-[40px]"
                >
                  <Crown className="w-3 h-3 mr-2" />
                  {subscription.tier === 'starter' ? 'Upgrade Now' : 'Upgrade to Studio'}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default UsageDisplay;
