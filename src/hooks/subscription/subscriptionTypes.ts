
import { UserSubscription } from '@/types/subscription';
import { BillingDetails } from './subscriptionApi';

export interface SubscriptionContextType {
  subscription: UserSubscription;
  billingDetails: BillingDetails | null;
  loading: boolean;
  
  // Subscription checks
  checkSubscription: () => Promise<void>;
  verifySubscriptionStatus: () => Promise<void>;
  
  // Operations
  createCheckout: (planType: 'creator' | 'studio') => Promise<void>;
  createOptimisticCheckout: (planType: 'creator' | 'studio') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  
  // Feature helpers
  isSubscribed: boolean;
  canUseFeature: (feature: string) => boolean;
  features: any;
  getRemainingFeatures: (currentTier: string) => string[];
  getUpgradeMessage: (feature: string, requiredTier: string) => string;
}
