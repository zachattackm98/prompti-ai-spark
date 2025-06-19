
import { useState } from 'react';
import { UserSubscription } from '@/types/subscription';
import { BillingDetails } from './subscriptionApi';

export const useSubscriptionState = () => {
  // Start with loading true to prevent race conditions
  const [loading, setLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
  
  // Initialize with more robust default state
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    // Try to load from cache but don't trust it completely
    try {
      const cached = localStorage.getItem('subscription_cache');
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const cacheAge = Date.now() - (parsedCache.timestamp || 0);
        
        // Only use cache if it's very recent (less than 1 minute) and has valid structure
        if (cacheAge < 60000 && parsedCache.tier && typeof parsedCache.isActive === 'boolean') {
          console.log('[SUBSCRIPTION] Loading initial state from recent cache:', parsedCache);
          return {
            tier: parsedCache.tier,
            isActive: parsedCache.isActive,
            isCancelling: parsedCache.isCancelling || false,
            expiresAt: parsedCache.expiresAt,
          };
        } else {
          console.log('[SUBSCRIPTION] Cache too old or invalid, clearing and using defaults');
          localStorage.removeItem('subscription_cache');
        }
      }
    } catch (error) {
      console.log('[SUBSCRIPTION] Error reading cache, using defaults:', error);
      localStorage.removeItem('subscription_cache');
    }
    
    // Default to starter tier with active status for basic functionality
    console.log('[SUBSCRIPTION] Using default starter subscription state');
    return {
      tier: 'starter',
      isActive: true,
      isCancelling: false,
    };
  });

  // Enhanced setSubscription with validation and logging
  const setSubscriptionWithValidation = (newSubscription: UserSubscription) => {
    console.log('[SUBSCRIPTION] Updating subscription state:', {
      previous: subscription,
      new: newSubscription
    });
    
    // Validate the subscription object
    if (!newSubscription || !newSubscription.tier) {
      console.error('[SUBSCRIPTION] Invalid subscription object:', newSubscription);
      return;
    }
    
    // Ensure tier is valid
    const validTiers = ['starter', 'creator', 'studio'];
    if (!validTiers.includes(newSubscription.tier)) {
      console.error('[SUBSCRIPTION] Invalid tier:', newSubscription.tier);
      return;
    }
    
    // Ensure isActive is boolean
    const validatedSubscription = {
      ...newSubscription,
      isActive: Boolean(newSubscription.isActive),
      isCancelling: Boolean(newSubscription.isCancelling),
    };
    
    setSubscription(validatedSubscription);
    console.log('[SUBSCRIPTION] Subscription state updated successfully');
  };

  return {
    loading,
    setLoading,
    billingDetails,
    setBillingDetails,
    subscription,
    setSubscription: setSubscriptionWithValidation,
  };
};
