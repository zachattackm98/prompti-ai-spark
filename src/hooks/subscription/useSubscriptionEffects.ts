
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionEffects = (
  user: any,
  setLoading: (loading: boolean) => void,
  setSubscription: (subscription: any) => void,
  setBillingDetails: (billing: any) => void
) => {
  
  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Subscription check error:', error);
        setSubscription({ tier: 'starter', isActive: false });
        return;
      }

      setSubscription(data.subscription || { tier: 'starter', isActive: false });
      setBillingDetails(data.billing || null);
    } catch (error) {
      console.error('Subscription check failed:', error);
      setSubscription({ tier: 'starter', isActive: false });
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setSubscription, setBillingDetails]);

  const verifySubscriptionStatus = useCallback(async () => {
    // Same implementation as checkSubscription for now
    await checkSubscription();
  }, [checkSubscription]);

  // Auto-check subscription when user changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    checkSubscription,
    verifySubscriptionStatus
  };
};
