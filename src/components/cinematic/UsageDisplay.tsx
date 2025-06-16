
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, AlertCircle, TrendingUp } from 'lucide-react';
import { usePromptUsage } from '@/hooks/usePromptUsage';

interface UsageDisplayProps {
  onUpgrade?: () => void;
}

const UsageDisplay = ({ onUpgrade }: UsageDisplayProps) => {
  const { 
    usage, 
    loading, 
    remainingPrompts, 
    hasReachedLimit, 
    usagePercentage, 
    isStarterPlan 
  } = usePromptUsage();

  if (!isStarterPlan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-purple-400/50 text-purple-300">
                Starter Plan
              </Badge>
              {hasReachedLimit && (
                <AlertCircle className="w-4 h-4 text-orange-400" />
              )}
            </div>
          </div>
          {onUpgrade && (
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

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Monthly Prompts Used</span>
            <span className="text-white font-medium">
              {loading ? '...' : `${usage?.prompt_count || 0}/5`}
            </span>
          </div>

          <Progress value={usagePercentage} className="h-2" />

          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${hasReachedLimit ? 'text-orange-400' : 'text-gray-400'}`}>
              {hasReachedLimit ? (
                <>
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Limit reached
                </>
              ) : (
                `${remainingPrompts} prompts remaining`
              )}
            </span>
            <span className="text-gray-500">
              Resets monthly
            </span>
          </div>

          {hasReachedLimit && (
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <div className="flex items-center gap-2 text-sm text-orange-300 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Ready to create more?</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Upgrade to Creator or Studio plan for unlimited prompts and advanced features.
              </p>
              {onUpgrade && (
                <Button
                  onClick={onUpgrade}
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Crown className="w-3 h-3 mr-2" />
                  Upgrade Now
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
