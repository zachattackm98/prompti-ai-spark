
import { useCheckoutOperations } from './checkoutOperations';
import { usePortalOperations } from './portalOperations';

export const useSubscriptionOperations = (
  user: any,
  setLoading: (loading: boolean) => void,
  subscription: any,
  setSubscription: (subscription: any) => void
) => {
  const { createCheckout, createOptimisticCheckout } = useCheckoutOperations(
    user,
    setLoading,
    subscription,
    setSubscription
  );

  const { openCustomerPortal } = usePortalOperations(
    user,
    setLoading
  );

  return {
    createCheckout,
    createOptimisticCheckout,
    openCustomerPortal,
  };
};
