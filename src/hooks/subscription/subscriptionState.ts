
import { useState } from 'react';
import { UserSubscription } from '@/types/subscription';
import { BillingDetails } from './subscriptionApi';

export const useSubscriptionState = () => {
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: 'starter',
    isActive: true,
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
