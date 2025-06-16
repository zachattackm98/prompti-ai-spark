
import React, { createContext, useState, useEffect } from 'react';
import { UserSubscription, SubscriptionTier, TIER_FEATURES } from '@/types/subscription';
import { useAuth } from '../useAuth';
import { SubscriptionContextType } from './subscriptionTypes';
import { 
  BillingDetails, 
  checkSubscription as apiCheckSubscription,
  createCheckoutSession,
  openCustomerPortal as apiOpenCustomerPortal,
  handleCheckoutRedirect,
  showToast
} from './subscriptionApi';

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: 'starter',
    isActive: true,
  });

  const checkSubscription = async () => {
    if (!user) {
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
      return;
    }

    setLoading(true);
    try {
      console.log('[SUBSCRIPTION] Checking subscription for user:', user.email);
      const data = await apiCheckSubscription();

      setSubscription({
        tier: data.subscription_tier || 'starter',
        isActive: data.subscribed || false,
        expiresAt: data.subscription_end,
      });

      setBillingDetails(data.billing_details);
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error checking subscription:', error);
      showToast(
        "Error",
        "Failed to check subscription status. Please try again.",
        "destructive"
      );
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (planType: 'creator' | 'studio') => {
    if (!user) {
      showToast(
        "Authentication Required",
        "Please sign in to subscribe.",
        "destructive"
      );
      return;
    }

    setLoading(true);
    
    try {
      const data = await createCheckoutSession(planType);
      handleCheckoutRedirect(data.url);
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error creating checkout:', error);
      const errorMessage = error.message || 'Failed to create checkout session';
      showToast(
        "Checkout Error",
        errorMessage + ". Please try again or contact support.",
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await apiOpenCustomerPortal();
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      showToast(
        "Error",
        "Failed to open customer portal. Please try again.",
        "destructive"
      );
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
      showToast(
        "Payment Successful!",
        "Your subscription has been activated. Refreshing your account status..."
      );
      // Remove the URL param and refresh subscription
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => checkSubscription(), 2000);
    } else if (checkout === 'cancelled') {
      showToast(
        "Payment Cancelled",
        "Your subscription process was cancelled.",
        "destructive"
      );
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
      billingDetails,
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
