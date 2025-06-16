
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { PricingPlan } from './types';
import { useToast } from '@/hooks/use-toast';

export const usePricingLogic = () => {
  const { user } = useAuth();
  const { subscription, createOptimisticCheckout, loading } = useSubscription();
  const { toast } = useToast();

  const handlePlanClick = async (plan: PricingPlan) => {
    console.log('[PRICING] Plan clicked:', plan.name, 'tier:', plan.tier);
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    // Handle free plan
    if (plan.tier === 'starter') {
      toast({
        title: "You're on the Starter plan",
        description: "You already have access to the free Starter features.",
      });
      return;
    }

    // Handle current plan
    if (isCurrentPlan(plan.tier)) {
      toast({
        title: "Current Plan",
        description: `You're already subscribed to the ${plan.name}.`,
      });
      return;
    }

    // Create optimistic checkout for paid plans
    if (plan.tier === 'creator' || plan.tier === 'studio') {
      console.log('[PRICING] Creating optimistic checkout for tier:', plan.tier);
      
      const isUpgrade = subscription.tier !== 'starter' && subscription.tier !== plan.tier;
      
      try {
        await createOptimisticCheckout(plan.tier);
        
        // Show optimistic success message
        const message = isUpgrade 
          ? `Upgrading from ${subscription.tier} to ${plan.name}. Your previous subscription will be cancelled automatically.`
          : `Switching to ${plan.name}. You'll be redirected to complete payment.`;
          
        toast({
          title: isUpgrade ? "Upgrading Your Plan" : "Subscribing to Plan",
          description: message,
        });
      } catch (error: any) {
        console.error('[PRICING] Optimistic checkout failed:', error);
        
        let errorMessage = "Failed to start checkout process. Please try again.";
        if (error.message?.includes('already have an active')) {
          errorMessage = error.message;
        } else if (error.message?.includes('Cannot downgrade')) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Checkout Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const getButtonText = (plan: PricingPlan) => {
    if (!user) {
      return plan.tier === 'starter' ? 'Get Started Free' : 'Sign In to Subscribe';
    }
    
    // For starter plan, check if user's actual subscription is starter
    if (plan.tier === 'starter') {
      return subscription.tier === 'starter' ? 'Current Plan' : 'Starter Free';
    }
    
    if (isCurrentPlan(plan.tier)) {
      return 'Current Plan';
    }
    
    if (loading) {
      return 'Processing...';
    }
    
    const isUpgrade = subscription.tier !== 'starter' && subscription.tier !== plan.tier;
    return isUpgrade ? `Upgrade to ${plan.name}` : `Get ${plan.name}`;
  };

  const isCurrentPlan = (tier: string) => {
    return subscription.tier === tier;
  };

  return {
    user,
    subscription,
    loading,
    handlePlanClick,
    getButtonText,
    isCurrentPlan,
  };
};
