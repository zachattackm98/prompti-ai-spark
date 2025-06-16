
import React, { createContext } from 'react';
import { useAuth } from '../useAuth';
import { SubscriptionContextType } from './subscriptionTypes';
import { useSubscriptionState } from './subscriptionState';
import { useSubscriptionEffects } from './subscriptionEffects';
import { useSubscriptionOperations } from './subscriptionOperations';
import { createSubscriptionHelpers } from './subscriptionHelpers';

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  const {
    loading,
    setLoading,
    billingDetails,
    setBillingDetails,
    subscription,
    setSubscription,
  } = useSubscriptionState();

  const { checkSubscription, verifySubscriptionStatus } = useSubscriptionEffects(
    user,
    setLoading,
    setSubscription,
    setBillingDetails
  );

  const { createCheckout, createOptimisticCheckout, openCustomerPortal } = useSubscriptionOperations(
    user,
    setLoading,
    subscription,
    setSubscription
  );

  const subscriptionHelpers = createSubscriptionHelpers(subscription);

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      billingDetails,
      loading,
      checkSubscription,
      verifySubscriptionStatus,
      createCheckout,
      createOptimisticCheckout,
      openCustomerPortal,
      ...subscriptionHelpers,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
