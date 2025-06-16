
import { useEffect } from 'react';
import { UserSubscription } from '@/types/subscription';
import { BillingDetails, checkSubscription as apiCheckSubscription, showToast } from './subscriptionApi';

export const useSubscriptionEffects = (
  user: any,
  setLoading: (loading: boolean) => void,
  setSubscription: (subscription: UserSubscription) => void,
  setBillingDetails: (details: BillingDetails | null) => void
) => {
  const checkSubscription = async (retryCount = 0, maxRetries = 3) => {
    if (!user) {
      console.log('[SUBSCRIPTION] No user found, setting starter subscription');
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
      return;
    }

    setLoading(true);
    try {
      console.log('[SUBSCRIPTION] Checking subscription for user:', user.email, `(attempt ${retryCount + 1})`);
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

      // Store successful subscription data in localStorage for persistence
      localStorage.setItem('subscription_cache', JSON.stringify({
        tier: data.subscription_tier || 'starter',
        isActive: data.subscribed || false,
        expiresAt: data.subscription_end,
        timestamp: Date.now()
      }));

    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error checking subscription:', error);
      
      // Retry logic for failed attempts
      if (retryCount < maxRetries) {
        console.log(`[SUBSCRIPTION] Retrying in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => {
          checkSubscription(retryCount + 1, maxRetries);
        }, (retryCount + 1) * 1000);
        return;
      }
      
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
      
      // Try to load from cache as fallback
      const cachedData = localStorage.getItem('subscription_cache');
      if (cachedData) {
        try {
          const cached = JSON.parse(cachedData);
          console.log('[SUBSCRIPTION] Loading from cache:', cached);
          setSubscription({
            tier: cached.tier,
            isActive: cached.isActive,
            expiresAt: cached.expiresAt,
          });
        } catch (e) {
          console.error('[SUBSCRIPTION] Failed to parse cached data');
        }
      } else {
        setSubscription({ tier: 'starter', isActive: false });
      }
      setBillingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Progressive verification system
  const progressiveVerification = async (expectedTier: string) => {
    console.log('[SUBSCRIPTION] Starting progressive verification for tier:', expectedTier);
    
    // Immediate check
    await checkSubscription();
    
    // Follow-up checks with exponential backoff
    const intervals = [1000, 3000, 10000]; // 1s, 3s, 10s
    
    for (let i = 0; i < intervals.length; i++) {
      setTimeout(async () => {
        console.log(`[SUBSCRIPTION] Progressive verification check ${i + 1}`);
        await checkSubscription();
      }, intervals[i]);
    }
  };

  // Check subscription when user changes
  useEffect(() => {
    console.log('[SUBSCRIPTION] User state changed:', user?.email || 'no user');
    checkSubscription();
  }, [user]);

  // Enhanced checkout success/cancel handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkout = urlParams.get('checkout');
    
    if (checkout === 'success') {
      console.log('[SUBSCRIPTION] Checkout success detected');
      
      // Get expected tier from URL or storage
      const expectedTier = urlParams.get('tier') || sessionStorage.getItem('pending_tier');
      
      showToast(
        "Payment Successful!",
        "Your subscription is being activated. We're updating your account status..."
      );
      
      // Remove URL params immediately
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear pending tier
      sessionStorage.removeItem('pending_tier');
      
      // Start progressive verification
      if (expectedTier) {
        progressiveVerification(expectedTier);
      } else {
        // Immediate refresh without delay
        checkSubscription();
      }
      
    } else if (checkout === 'cancelled') {
      console.log('[SUBSCRIPTION] Checkout cancelled detected');
      showToast(
        "Payment Cancelled",
        "Your subscription process was cancelled.",
        "destructive"
      );
      window.history.replaceState({}, document.title, window.location.pathname);
      sessionStorage.removeItem('pending_tier');
    }
  }, []);

  return {
    checkSubscription,
    progressiveVerification,
  };
};
