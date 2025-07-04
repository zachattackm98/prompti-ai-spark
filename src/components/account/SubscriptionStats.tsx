
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp 
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { usePromptUsage } from '@/hooks/usePromptUsage';

const SubscriptionStats = () => {
  const { subscription, features } = useSubscription();
  const { usage, remainingPrompts, usagePercentage, promptLimit } = usePromptUsage();

  // Calculate stats based on actual usage data
  const stats = {
    promptsUsed: usage?.prompt_count || 0,
    promptsLimit: promptLimit,
    daysUntilRenewal: subscription.expiresAt ? 
      Math.ceil((new Date(subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
      null,
    featuresUnlocked: Object.values(features).filter(feature => 
      feature === true || (typeof feature === 'number' && feature > 0) || 
      (Array.isArray(feature) && feature.length > 0)
    ).length
  };

  return (
    <Card className="bg-slate-900/50 border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Activity className="w-5 h-5 text-purple-400 flex-shrink-0" />
        <h3 className="text-lg font-semibold text-white">Usage Stats</h3>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Prompts Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Prompts This Month</span>
            <span className="text-sm font-medium text-white">
              {stats.promptsUsed}/{stats.promptsLimit}
            </span>
          </div>
          <Progress 
            value={usagePercentage} 
            className="h-2"
          />
          {remainingPrompts > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {remainingPrompts} prompts remaining this month
            </p>
          )}
          {remainingPrompts === 0 && (
            <p className="text-xs text-orange-400 mt-1">
              Monthly limit reached
            </p>
          )}
        </div>

        {/* Features Unlocked */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-sm text-gray-400">Features Unlocked</span>
          </div>
          <Badge className="bg-purple-600 hover:bg-purple-700 text-xs">
            {stats.featuresUnlocked}
          </Badge>
        </div>

        {/* Renewal Info */}
        {stats.daysUntilRenewal && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-400">Days Until Renewal</span>
            </div>
            <span className="text-sm font-medium text-white">
              {stats.daysUntilRenewal}
            </span>
          </div>
        )}

        {/* Subscription Value */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <TrendingUp className="w-3 h-3 flex-shrink-0" />
            <span>Current Plan Value</span>
          </div>
          <div className="text-lg font-semibold text-white capitalize">
            {subscription.tier} Plan
          </div>
          {subscription.tier !== 'starter' && (
            <div className="text-xs text-green-400">
              Premium features active
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionStats;
