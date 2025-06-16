
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
      console.log('[SUBSCRIPTION] No user found, setting starter subscription');
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
      return;
    }

    setLoading(true);
    try {
      console.log('[SUBSCRIPTION] Checking subscription for user:', user.email);
      const data = await apiCheckSubscription();

      console.log('[SUBSCRIPTION] Subscription data received:', data);
      
      setSubscription({
        tier: data.subscription_tier || 'starter',
        isActive: data.subscribed || false,
        expiresAt: data.subscription_end,
      });

      setBillingDetails(data.billing_details || null);
      
      console.log('[SUBSCRIPTION] Subscription state updated:', {
        tier: data.subscription_tier || 'starter',
        isActive: data.subscribed || false,
        expiresAt: data.subscription_end
      });
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error checking subscription:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to check subscription status";
      if (error.message?.includes('Authentication')) {
        errorMessage = "Authentication failed. Please sign in again.";
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      showToast(
        "Subscription Check Failed",
        errorMessage,
        "destructive"
      );
      
      // Set fallback state
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (planType: 'creator' | 'studio') => {
    if (!user) {
      console.error('[SUBSCRIPTION] No user found for checkout');
      showToast(
        "Authentication Required",
        "Please sign in to subscribe.",
        "destructive"
      );
      return;
    }

    console.log('[SUBSCRIPTION] Starting checkout process for:', planType);
    setLoading(true);
    
    try {
      console.log('[SUBSCRIPTION] Creating checkout session...');
      const data = await createCheckoutSession(planType);
      
      console.log('[SUBSCRIPTION] Checkout session created, redirecting...');
      handleCheckoutRedirect(data.url);
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error creating checkout:', error);
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Failed to create checkout session';
      let errorTitle = 'Checkout Error';
      
      if (error.message?.includes('Authentication')) {
        errorTitle = 'Authentication Error';
        errorMessage = 'Your session has expired. Please sign in again.';
      } else if (error.message?.includes('Invalid plan')) {
        errorTitle = 'Invalid Plan';
        errorMessage = 'The selected plan is not available. Please try again.';
      } else if (error.message?.includes('STRIPE_SECRET_KEY')) {
        errorTitle = 'Configuration Error';
        errorMessage = 'Payment system is not configured. Please contact support.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorTitle = 'Network Error';
        errorMessage = 'Connection failed. Please check your internet and try again.';
      } else if (error.message?.includes('checkout URL')) {
        errorTitle = 'Checkout Error';
        errorMessage = 'Failed to create payment page. Please try again.';
      }
      
      showToast(errorTitle, errorMessage, "destructive");
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      console.error('[SUBSCRIPTION] No user found for customer portal');
      return;
    }

    console.log('[SUBSCRIPTION] Opening customer portal...');
    setLoading(true);
    
    try {
      const data = await apiOpenCustomerPortal();
      
      if (data?.url) {
        console.log('[SUBSCRIPTION] Opening customer portal in new tab');
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error opening customer portal:', error);
      
      let errorMessage = "Failed to open customer portal";
      if (error.message?.includes('Authentication')) {
        errorMessage = "Your session has expired. Please sign in again.";
      } else if (error.message?.includes('No Stripe customer')) {
        errorMessage = "No subscription found. Please subscribe first.";
      }
      
      showToast(
        "Portal Error",
        errorMessage,
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[SUBSCRIPTION] User state changed:', user?.email || 'no user');
    checkSubscription();
  }, [user]);

  // Check for checkout success/cancel in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkout = urlParams.get('checkout');
    
    if (checkout === 'success') {
      console.log('[SUBSCRIPTION] Checkout success detected');
      showToast(
        "Payment Successful!",
        "Your subscription has been activated. Refreshing your account status..."
      );
      // Remove the URL param and refresh subscription
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        console.log('[SUBSCRIPTION] Refreshing subscription after successful checkout');
        checkSubscription();
      }, 2000);
    } else if (checkout === 'cancelled') {
      console.log('[SUBSCRIPTION] Checkout cancelled detected');
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
    const featureValue = features[feature];
    return featureValue !== false && featureValue !== 0;
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
