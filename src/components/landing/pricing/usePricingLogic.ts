
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { PricingPlan } from './types';
import { useToast } from '@/hooks/use-toast';

export const usePricingLogic = () => {
  const { user } = useAuth();
  const { subscription, createCheckout, loading } = useSubscription();
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

    // Create checkout for paid plans
    if (plan.tier === 'creator' || plan.tier === 'studio') {
      console.log('[PRICING] Creating checkout for tier:', plan.tier);
      
      try {
        await createCheckout(plan.tier);
        
        // Show success message for test mode
        toast({
          title: "Test Mode Active",
          description: "You're using Stripe test mode. Use test card 4242 4242 4242 4242 to complete the payment.",
        });
      } catch (error) {
        console.error('[PRICING] Checkout failed:', error);
        toast({
          title: "Checkout Error",
          description: "Failed to start checkout process. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getButtonText = (plan: PricingPlan) => {
    if (!user) {
      return plan.tier === 'starter' ? 'Get Started Free' : 'Sign In to Subscribe';
    }
    
    if (plan.tier === 'starter') {
      return 'Current Plan';
    }
    
    if (isCurrentPlan(plan.tier)) {
      return 'Current Plan';
    }
    
    if (loading) {
      return 'Processing...';
    }
    
    return `Upgrade to ${plan.name}`;
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
