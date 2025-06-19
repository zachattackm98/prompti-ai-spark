
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { TIER_FEATURES, SubscriptionTier } from '@/types/subscription';

interface PromptUsage {
  id: string;
  user_id: string;
  prompt_count: number;
  reset_date: string;
  created_at: string;
  updated_at: string;
}

interface UsePromptUsageProps {
  subscriptionTier?: SubscriptionTier;
}

export const usePromptUsage = (props?: UsePromptUsageProps) => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<PromptUsage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use provided tier or default to starter
  const tier = props?.subscriptionTier || 'starter';

  const fetchUsage = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('get_or_create_prompt_usage', { user_uuid: user.id });

      if (error) throw error;
      setUsage(data);
    } catch (err: any) {
      console.error('Error fetching prompt usage:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsage();
    } else {
      setUsage(null);
    }
  }, [user]);

  const getPromptLimit = () => {
    return TIER_FEATURES[tier].maxPrompts;
  };

  const getRemainingPrompts = () => {
    const limit = getPromptLimit();
    if (!usage) return limit;
    return Math.max(0, limit - usage.prompt_count);
  };

  const hasReachedLimit = () => {
    if (!usage) return false;
    const limit = getPromptLimit();
    return usage.prompt_count >= limit;
  };

  const getUsagePercentage = () => {
    if (!usage) return 0;
    const limit = getPromptLimit();
    return Math.min(100, (usage.prompt_count / limit) * 100);
  };

  return {
    usage,
    loading,
    error,
    refetchUsage: fetchUsage,
    remainingPrompts: getRemainingPrompts(),
    hasReachedLimit: hasReachedLimit(),
    usagePercentage: getUsagePercentage(),
    promptLimit: getPromptLimit(),
    isStarterPlan: tier === 'starter'
  };
};
