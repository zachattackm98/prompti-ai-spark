
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, AlertCircle, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface EnhancedUsageDisplayProps {
  onUpgrade?: () => void;
}

const EnhancedUsageDisplay = ({ onUpgrade }: EnhancedUsageDisplayProps) => {
  const { 
    subscription, 
    usage, 
    loading, 
    hasReachedLimit, 
    usageUrgency,
    needsRefresh,
    forceRefresh
  } = useSubscription();

  console.log('[ENHANCED-USAGE-DISPLAY] Current state:', {
    subscription,
    usage,
    hasReachedLimit,
    usageUrgency,
    needsRefresh
  });

  if (loading && !usage) {
    return (
      <Card className="bg-slate-900/70 border border-white/20 p-4 backdrop-blur-sm animate-pulse">
        <div className="h-20 bg-slate-800 rounded"></div>
      </Card>
    );
  }

  const tierConfig = {
    starter: {
      name: 'Starter Plan',
      color: 'border-purple-400/50 text-purple-300',
      gradient: 'from-slate-900/80 via-slate-900/60 to-purple-900/20',
      border: 'border-purple-500/20'
    },
    creator: {
      name: 'Creator Plan',
      color: 'border-blue-400/50 text-blue-300',
      gradient: 'from-slate-900/80 via-slate-900/60 to-blue-900/20',
      border: 'border-blue-500/20'
    },
    studio: {
      name: 'Studio Plan',
      color: 'border-yellow-400/50 text-yellow-300',
      gradient: 'from-slate-900/80 via-slate-900/60 to-yellow-900/20',
      border: 'border-yellow-500/20'
    }
  };

  const config = tierConfig[subscription.tier];
  const usagePercentage = usage ? Math.min(100, (usage.prompt_count / (usage.prompt_limit || 5)) * 100) : 0;
  const remainingPrompts = usage ? Math.max(0, (usage.prompt_limit || 5) - usage.prompt_count) : 0;

  const getUrgencyIcon = () => {
    switch (usageUrgency) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getUrgencyColor = () => {
    switch (usageUrgency) {
      case 'critical':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className={`bg-gradient-to-r ${config.gradient} border ${config.border} p-4 backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`border-opacity-50 ${config.color}`}>
                {config.name}
              </Badge>
              {getUrgencyIcon()}
              {!subscription.isActive && subscription.tier !== 'starter' && (
                <Badge variant="destructive" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {needsRefresh && (
              <Button
                onClick={forceRefresh}
                size="sm"
                variant="outline"
                className="text-xs border-yellow-500/30 text-yellow-400"
              >
                Refresh
              </Button>
            )}
            {onUpgrade && subscription.tier !== 'studio' && (
              <Button
                onClick={onUpgrade}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Crown className="w-3 h-3 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Monthly Prompts Used</span>
            <span className="text-white font-medium">
              {loading ? '...' : `${usage?.prompt_count || 0}/${usage?.prompt_limit || 5}`}
            </span>
          </div>

          <Progress value={usagePercentage} className="h-2" />

          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${getUrgencyColor()}`}>
              {getUrgencyIcon()}
              <span className="ml-1">
                {hasReachedLimit ? 'Limit reached' : `${remainingPrompts} prompts remaining`}
              </span>
            </span>
            <span className="text-gray-500">
              Resets monthly
            </span>
          </div>

          {!subscription.isActive && subscription.tier !== 'starter' && (
            <div className="mt-3 pt-3 border-t border-red-500/20">
              <div className="flex items-center gap-2 text-sm text-red-300 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Subscription Inactive</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Your subscription is not active. Please update your billing to continue using premium features.
              </p>
              {onUpgrade && (
                <Button
                  onClick={onUpgrade}
                  size="sm"
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                >
                  <Crown className="w-3 h-3 mr-2" />
                  Reactivate Subscription
                </Button>
              )}
            </div>
          )}

          {(hasReachedLimit || usageUrgency === 'high') && subscription.isActive && (
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <div className="flex items-center gap-2 text-sm text-orange-300 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>
                  {hasReachedLimit ? 'Ready to create more?' : 'Usage Warning'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                {subscription.tier === 'starter' && 'Upgrade to Creator (500/month) or Studio (1000/month) for more prompts.'}
                {subscription.tier === 'creator' && 'Upgrade to Studio plan for 1000 prompts per month.'}
                {subscription.tier === 'studio' && 'Your usage will reset next month.'}
              </p>
              {onUpgrade && subscription.tier !== 'studio' && (
                <Button
                  onClick={onUpgrade}
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
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

export default EnhancedUsageDisplay;
