
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';

interface PromptUsage {
  id: string;
  user_id: string;
  prompt_count: number;
  reset_date: string;
  created_at: string;
  updated_at: string;
}

export const usePromptUsage = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [usage, setUsage] = useState<PromptUsage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    if (!user || subscription.tier !== 'starter') return;

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
    if (user && subscription.tier === 'starter') {
      fetchUsage();
    } else {
      setUsage(null);
    }
  }, [user, subscription.tier]);

  const getRemainingPrompts = () => {
    if (subscription.tier !== 'starter') return -1; // Unlimited
    if (!usage) return 5; // Default limit
    return Math.max(0, 5 - usage.prompt_count);
  };

  const hasReachedLimit = () => {
    if (subscription.tier !== 'starter') return false;
    if (!usage) return false;
    return usage.prompt_count >= 5;
  };

  const getUsagePercentage = () => {
    if (subscription.tier !== 'starter') return 0;
    if (!usage) return 0;
    return Math.min(100, (usage.prompt_count / 5) * 100);
  };

  return {
    usage,
    loading,
    error,
    refetchUsage: fetchUsage,
    remainingPrompts: getRemainingPrompts(),
    hasReachedLimit: hasReachedLimit(),
    usagePercentage: getUsagePercentage(),
    isStarterPlan: subscription.tier === 'starter'
  };
};
