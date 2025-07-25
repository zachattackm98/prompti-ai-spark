
import { UserSubscription } from '@/types/subscription';
import { BillingDetails } from './subscriptionApi';
import { BillingData } from './billingOperations';

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
  fetchBillingData: () => Promise<BillingData | null>;
  downloadInvoice: (invoiceId: string, downloadUrl: string) => Promise<void>;
  
  // Feature helpers
  isSubscribed: boolean;
  canUseFeature: (feature: string) => boolean;
  features: any;
  getRemainingFeatures: (currentTier: string) => string[];
  getUpgradeMessage: (feature: string, requiredTier: string) => string;
  getNextUpgradeTier: () => string | null;
  getUpgradeDetails: () => {
    targetTier: string;
    targetTierName: string;
    currentPrompts: number;
    nextPrompts: number;
    additionalPrompts: number;
    upgradeText: string;
  } | null;
}
