
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { PricingPlan } from './types';

export const usePricingLogic = () => {
  const { user } = useAuth();
  const { subscription, createCheckout, openCustomerPortal, loading } = useSubscription();

  const handlePlanClick = async (planTier: string) => {
    if (planTier === 'starter') {
      // Starter is free, no action needed
      return;
    }

    if (!user) {
      // Redirect to sign up if not authenticated
      document.getElementById('auth-dialog-trigger')?.click();
      return;
    }

    if (subscription.tier === planTier && subscription.isActive) {
      // Already subscribed to this plan, open customer portal
      await openCustomerPortal();
    } else {
      // Subscribe to new plan
      await createCheckout(planTier as 'creator' | 'studio');
    }
  };

  const getButtonText = (plan: PricingPlan) => {
    if (plan.tier === 'starter') return plan.cta;
    
    if (!user) return plan.cta;
    
    if (subscription.tier === plan.tier && subscription.isActive) {
      return 'Manage Subscription';
    }
    
    return plan.cta;
  };

  const isCurrentPlan = (planTier: string) => {
    return subscription.tier === planTier && subscription.isActive;
  };

  return {
    user,
    subscription,
    loading,
    handlePlanClick,
    getButtonText,
    isCurrentPlan
  };
};
