
import { useEnhancedSubscriptionContext } from './subscription/EnhancedSubscriptionProvider';

// Main hook that components should use
export const useSubscription = () => {
  return useEnhancedSubscriptionContext();
};

// Re-export the enhanced provider
export { EnhancedSubscriptionProvider as SubscriptionProvider } from './subscription/EnhancedSubscriptionProvider';
export type { SubscriptionContextType } from './subscription/subscriptionTypes';
