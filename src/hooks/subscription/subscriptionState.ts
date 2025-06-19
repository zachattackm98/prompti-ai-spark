
import { useState } from 'react';
import { UserSubscription } from '@/types/subscription';
import { BillingDetails } from './subscriptionApi';

export const useSubscriptionState = () => {
  // Start with loading true to prevent race conditions
  const [loading, setLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: 'starter',
    isActive: false,
    isCancelling: false,
  });

  return {
    loading,
    setLoading,
    billingDetails,
    setBillingDetails,
    subscription,
    setSubscription,
  };
};
