
import { useCheckoutOperations } from './checkoutOperations';
import { usePortalOperations } from './portalOperations';
import { useBillingOperations } from './billingOperations';

export const useSubscriptionOperations = (
  user: any,
  setLoading: (loading: boolean) => void,
  subscription: any,
  setSubscription: (subscription: any) => void
) => {
  const { createCheckout } = useCheckoutOperations(
    user,
    setLoading,
    subscription,
    setSubscription
  );

  const { openCustomerPortal } = usePortalOperations(
    user,
    setLoading
  );

  const { fetchBillingData, downloadInvoice } = useBillingOperations(
    user,
    setLoading
  );

  // Create optimistic checkout is the same as regular checkout for now
  const createOptimisticCheckout = createCheckout;

  return {
    createCheckout,
    createOptimisticCheckout,
    openCustomerPortal,
    fetchBillingData,
    downloadInvoice,
  };
};
