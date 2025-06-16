
import { supabase } from '@/integrations/supabase/client';
import { showToast } from './subscriptionApi';

export interface Invoice {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  status: string;
  description: string;
  downloadUrl: string;
  invoiceNumber: string;
}

export interface BillingData {
  invoices: Invoice[];
  hasPaymentMethod: boolean;
}

export const useBillingOperations = (
  user: any,
  setLoading: (loading: boolean) => void
) => {
  const fetchBillingData = async (): Promise<BillingData | null> => {
    if (!user) {
      console.error('[BILLING] No user found for billing data fetch');
      return null;
    }

    console.log('[BILLING] Fetching billing data...');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-billing-data', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        console.error('[BILLING] Error fetching billing data:', error);
        throw error;
      }

      console.log('[BILLING] Billing data received:', data);
      
      // Parse dates properly
      const parsedData = {
        ...data,
        invoices: data.invoices.map((invoice: any) => ({
          ...invoice,
          date: new Date(invoice.date)
        }))
      };

      return parsedData;
    } catch (error: any) {
      console.error('[BILLING] Failed to fetch billing data:', error);
      
      let errorMessage = "Failed to fetch billing data";
      if (error.message?.includes('Authentication')) {
        errorMessage = "Your session has expired. Please sign in again.";
      } else if (error.message?.includes('No Stripe customer')) {
        errorMessage = "No billing history found.";
      }
      
      showToast(
        "Billing Error",
        errorMessage,
        "destructive"
      );
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string, downloadUrl: string) => {
    console.log('[BILLING] Downloading invoice:', invoiceId);
    
    try {
      if (downloadUrl) {
        // Open the Stripe-hosted PDF in a new tab
        window.open(downloadUrl, '_blank');
        showToast(
          "Invoice Download",
          "Invoice opened in new tab"
        );
      } else {
        throw new Error('No download URL available');
      }
    } catch (error) {
      console.error('[BILLING] Error downloading invoice:', error);
      showToast(
        "Download Error",
        "Failed to download invoice. Please try again.",
        "destructive"
      );
    }
  };

  return {
    fetchBillingData,
    downloadInvoice,
  };
};
