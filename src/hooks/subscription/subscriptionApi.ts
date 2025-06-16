
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
    throw new Error('No valid session found');
  }

  const { data, error } = await supabase.functions.invoke('check-subscription', {
    headers: {
      Authorization: `Bearer ${session.data.session.access_token}`,
    },
  });

  if (error) {
    console.error('[SUBSCRIPTION] Error from check-subscription function:', error);
    throw error;
  }

  console.log('[SUBSCRIPTION] Response from check-subscription:', data);
  return data;
};

export const createCheckoutSession = async (planType: 'creator' | 'studio') => {
  console.log('[SUBSCRIPTION] Creating checkout for plan:', planType);
  
  const session = await supabase.auth.getSession();
  if (!session.data.session?.access_token) {
    throw new Error('No valid session found');
  }

  console.log('[SUBSCRIPTION] Invoking create-checkout function with body:', { planType });
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: JSON.stringify({ planType }),
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
    throw new Error('No checkout URL received from server');
  }

  return data;
};

export const openCustomerPortal = async () => {
  const session = await supabase.auth.getSession();
  if (!session.data.session?.access_token) {
    throw new Error('No valid session found');
  }

  const { data, error } = await supabase.functions.invoke('customer-portal', {
    headers: {
      Authorization: `Bearer ${session.data.session.access_token}`,
    },
  });

  if (error) {
    console.error('Error opening customer portal:', error);
    throw error;
  }

  return data;
};

export const handleCheckoutRedirect = (url: string) => {
  console.log('[SUBSCRIPTION] Opening checkout URL:', url);
  // Try to open in the same window first, fallback to new tab if blocked
  try {
    window.location.href = url;
  } catch (popupError) {
    console.log('[SUBSCRIPTION] Redirect failed, trying new tab:', popupError);
    window.open(url, '_blank');
  }
};

export const showToast = (title: string, description: string, variant?: 'default' | 'destructive') => {
  toast({
    title,
    description,
    variant,
  });
};
