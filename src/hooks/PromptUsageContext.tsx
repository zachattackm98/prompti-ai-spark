
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { TIER_FEATURES } from '@/types/subscription';

interface PromptUsage {
  id: string;
  user_id: string;
  prompt_count: number;
  reset_date: string;
  created_at: string;
  updated_at: string;
}

interface PromptUsageContextType {
  usage: PromptUsage | null;
  loading: boolean;
  error: string | null;
  refetchUsage: () => Promise<void>;
  triggerUsageUpdate: () => void;
  remainingPrompts: number;
  hasReachedLimit: boolean;
  usagePercentage: number;
  promptLimit: number;
  isStarterPlan: boolean;
}

const PromptUsageContext = createContext<PromptUsageContextType | undefined>(undefined);

export const PromptUsageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [usage, setUsage] = useState<PromptUsage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchUsage = async () => {
    if (!user) {
      setUsage(null);
      return;
    }

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

  const triggerUsageUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchUsage();
  }, [user, updateTrigger]);

  const getPromptLimit = () => {
    return TIER_FEATURES[subscription.tier].maxPrompts;
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

  const value: PromptUsageContextType = {
    usage,
    loading,
    error,
    refetchUsage: fetchUsage,
    triggerUsageUpdate,
    remainingPrompts: getRemainingPrompts(),
    hasReachedLimit: hasReachedLimit(),
    usagePercentage: getUsagePercentage(),
    promptLimit: getPromptLimit(),
    isStarterPlan: subscription.tier === 'starter'
  };

  return (
    <PromptUsageContext.Provider value={value}>
      {children}
    </PromptUsageContext.Provider>
  );
};

export const usePromptUsageContext = () => {
  const context = useContext(PromptUsageContext);
  if (context === undefined) {
    throw new Error('usePromptUsageContext must be used within a PromptUsageProvider');
  }
  return context;
};
