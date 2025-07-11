
import React, { createContext } from 'react';
import { useAuth } from '../useAuth';
import { SubscriptionContextType } from './subscriptionTypes';
import { useSubscriptionState } from './subscriptionState';
import { useSubscriptionEffects } from './subscriptionEffects';
import { useSubscriptionOperations } from './subscriptionOperations';
import { createSubscriptionHelpers } from './subscriptionHelpers';
import { useFocusManager } from '../useFocusManager';

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
    checkoutSuccessInProgress,
    setCheckoutSuccessInProgress,
  } = useSubscriptionState();
  
  // Prevent subscription checks on window focus to avoid refresh issues
  useFocusManager({
    enabled: false, // Disable automatic focus handling for subscriptions
    throttleMs: 10000 // 10 second throttle if enabled
  });

  const { checkSubscription, verifySubscriptionStatus } = useSubscriptionEffects(
    user,
    setLoading,
    setSubscription,
    setBillingDetails,
    checkoutSuccessInProgress,
    setCheckoutSuccessInProgress
  );

  const { 
    createCheckout, 
    createOptimisticCheckout, 
    openCustomerPortal,
    fetchBillingData,
    downloadInvoice
  } = useSubscriptionOperations(
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
      fetchBillingData,
      downloadInvoice,
      ...subscriptionHelpers,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
