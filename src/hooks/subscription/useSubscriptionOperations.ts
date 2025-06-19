
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionOperations = (
  user: any,
  setLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();

  const createCheckout = useCallback(async (tier: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade your subscription.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier, userId: user.id }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
      
      return data;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to create checkout session",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, toast]);

  const openCustomerPortal = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access billing portal.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { userId: user.id }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Portal error:', error);
      toast({
        title: "Portal Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, toast]);

  const fetchBillingData = useCallback(async () => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-billing-data', {
        body: { userId: user.id }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Billing data error:', error);
      toast({
        title: "Billing Error",
        description: error.message || "Failed to fetch billing data",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, toast]);

  return {
    createCheckout,
    createOptimisticCheckout: createCheckout, // Same as regular checkout for now
    openCustomerPortal,
    fetchBillingData,
    downloadInvoice: async () => {
      toast({
        title: "Coming Soon",
        description: "Invoice download will be available soon.",
      });
    }
  };
};
