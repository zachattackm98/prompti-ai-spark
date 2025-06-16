
import { useContext } from 'react';
import { SubscriptionContext } from './subscription/SubscriptionProvider';

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

// Re-export the provider and types for convenience
export { SubscriptionProvider } from './subscription/SubscriptionProvider';
export type { SubscriptionContextType } from './subscription/subscriptionTypes';
