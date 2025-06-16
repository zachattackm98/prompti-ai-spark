import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface BillingDetails {
  current_period_start: string;
  current_period_end: string;
  status: string;
  cancel_at_period_end: boolean;
  amount: number;
  currency: string;
  interval: string;
  trial_end?: string | null;
  created: string;
}

export const checkSubscription = async () => {
  console.log('[SUBSCRIPTION] Checking subscription...');
  
  const session = await supabase.auth.getSession();
  if (!session.data.session?.access_token) {
    console.error('[SUBSCRIPTION] No valid session found');
    throw new Error('No valid session found');
  }

  console.log('[SUBSCRIPTION] Session found, calling check-subscription function');

  try {
    const { data, error } = await supabase.functions.invoke('check-subscription', {
      headers: {
        Authorization: `Bearer ${session.data.session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (error) {
      console.error('[SUBSCRIPTION] Error from check-subscription function:', error);
      throw error;
    }

    console.log('[SUBSCRIPTION] Response from check-subscription:', data);
    return data;
  } catch (error) {
    console.error('[SUBSCRIPTION] Failed to check subscription:', error);
    throw error;
  }
};

export const createCheckoutSession = async (planType: 'creator' | 'studio') => {
  console.log('[SUBSCRIPTION] Creating checkout for plan:', planType);
  
  // Validate plan type
  if (!['creator', 'studio'].includes(planType)) {
    throw new Error(`Invalid plan type: ${planType}`);
  }
  
  const session = await supabase.auth.getSession();
  if (!session.data.session?.access_token) {
    console.error('[SUBSCRIPTION] No valid session found');
    throw new Error('No valid session found');
  }

  const requestBody = { planType };
  console.log('[SUBSCRIPTION] Request body:', requestBody);

  try {
    console.log('[SUBSCRIPTION] Invoking create-checkout function');
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: requestBody, // Pass as plain object, not stringified
      headers: {
        Authorization: `Bearer ${session.data.session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (error) {
      console.error('[SUBSCRIPTION] Error from create-checkout function:', error);
      throw error;
    }

    console.log('[SUBSCRIPTION] Response from create-checkout:', data);

    if (!data?.url) {
      console.error('[SUBSCRIPTION] No checkout URL received');
      throw new Error('No checkout URL received from server');
    }

    return data;
  } catch (error) {
    console.error('[SUBSCRIPTION] Failed to create checkout session:', error);
    throw error;
  }
};

export const openCustomerPortal = async () => {
  console.log('[SUBSCRIPTION] Opening customer portal');
  
  const session = await supabase.auth.getSession();
  if (!session.data.session?.access_token) {
    console.error('[SUBSCRIPTION] No valid session found');
    throw new Error('No valid session found');
  }

  try {
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.data.session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (error) {
      console.error('[SUBSCRIPTION] Error opening customer portal:', error);
      throw error;
    }

    console.log('[SUBSCRIPTION] Customer portal response:', data);
    return data;
  } catch (error) {
    console.error('[SUBSCRIPTION] Failed to open customer portal:', error);
    throw error;
  }
};

export const handleCheckoutRedirect = (url: string) => {
  console.log('[SUBSCRIPTION] Opening checkout URL:', url);
  
  if (!url) {
    console.error('[SUBSCRIPTION] No URL provided for redirect');
    showToast('Error', 'No checkout URL received', 'destructive');
    return;
  }

  try {
    // Try to open in the same window first
    window.location.href = url;
  } catch (error) {
    console.warn('[SUBSCRIPTION] Redirect failed, trying new tab:', error);
    try {
      window.open(url, '_blank');
    } catch (popupError) {
      console.error('[SUBSCRIPTION] Failed to open checkout URL:', popupError);
      showToast('Error', 'Failed to open checkout page. Please try again.', 'destructive');
    }
  }
};

export const showToast = (title: string, description: string, variant?: 'default' | 'destructive') => {
  toast({
    title,
    description,
    variant,
  });
};
