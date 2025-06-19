
import React, { createContext, useContext } from 'react';
import { useEnhancedSubscription } from './useEnhancedSubscription';
import { SubscriptionTier, TIER_FEATURES, TierFeatures } from '@/types/subscription';

interface EnhancedSubscriptionContextType {
  // Core data
  user: any;
  subscription: any;
  billingDetails: any;
  loading: boolean;
  usage: any;
  hasReachedLimit: boolean;
  
  // Enhanced methods
  canUseFeature: (feature: keyof TierFeatures) => boolean;
  validateUsageForGeneration: () => any;
  createCheckout: (tier: 'creator' | 'studio') => Promise<void>;
  forceRefresh: () => Promise<void>;
  
  // Status indicators
  needsRefresh: boolean;
  usageUrgency: 'low' | 'medium' | 'high' | 'critical';
  
  // Features (added missing property)
  features: TierFeatures;
  
  // Legacy operations
  createOptimisticCheckout: (tier: 'creator' | 'studio') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  fetchBillingData: () => Promise<any>;
  downloadInvoice: (invoiceId: string, downloadUrl: string) => Promise<void>;
  checkSubscription: () => Promise<void>;
  verifySubscriptionStatus: () => Promise<void>;
}

const EnhancedSubscriptionContext = createContext<EnhancedSubscriptionContextType | undefined>(undefined);

export const useEnhancedSubscriptionContext = () => {
  const context = useContext(EnhancedSubscriptionContext);
  if (!context) {
    throw new Error('useEnhancedSubscriptionContext must be used within EnhancedSubscriptionProvider');
  }
  return context;
};

export const EnhancedSubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const subscriptionData = useEnhancedSubscription();

  return (
    <EnhancedSubscriptionContext.Provider value={subscriptionData}>
      {children}
    </EnhancedSubscriptionContext.Provider>
  );
};
