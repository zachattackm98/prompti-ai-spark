
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSubscription, SubscriptionTier, TIER_FEATURES } from '@/types/subscription';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionContextType {
  subscription: UserSubscription;
  features: typeof TIER_FEATURES[SubscriptionTier];
  hasFeature: (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => boolean;
  canUseFeature: (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => boolean;
  upgradeRequired: (targetTier: SubscriptionTier) => boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: (planType: 'creator' | 'studio') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: 'starter',
    isActive: true,
  });

  const checkSubscription = async () => {
    if (!user) {
      setSubscription({ tier: 'starter', isActive: false });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setSubscription({
        tier: data.subscription_tier || 'starter',
        isActive: data.subscribed || false,
        expiresAt: data.subscription_end,
      });
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      setSubscription({ tier: 'starter', isActive: false });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (planType: 'creator' | 'studio') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  // Check for checkout success/cancel in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkout = urlParams.get('checkout');
    
    if (checkout === 'success') {
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated. Refreshing your account status...",
      });
      // Remove the URL param and refresh subscription
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => checkSubscription(), 2000);
    } else if (checkout === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your subscription process was cancelled.",
        variant: "destructive",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const features = TIER_FEATURES[subscription.tier];

  const hasFeature = (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => {
    return features[feature] !== false && features[feature] !== 0;
  };

  const canUseFeature = (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => {
    return subscription.isActive && hasFeature(feature);
  };

  const upgradeRequired = (targetTier: SubscriptionTier) => {
    const tierOrder = { starter: 0, creator: 1, studio: 2 };
    return tierOrder[subscription.tier] < tierOrder[targetTier];
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      features,
      hasFeature,
      canUseFeature,
      upgradeRequired,
      checkSubscription,
      createCheckout,
      openCustomerPortal,
      loading,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};
