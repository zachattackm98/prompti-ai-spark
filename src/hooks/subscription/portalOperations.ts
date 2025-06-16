
import { 
  openCustomerPortal as apiOpenCustomerPortal,
  showToast
} from './subscriptionApi';

export const usePortalOperations = (
  user: any,
  setLoading: (loading: boolean) => void
) => {
  const openCustomerPortal = async () => {
    if (!user) {
      console.error('[SUBSCRIPTION] No user found for customer portal');
      return;
    }

    console.log('[SUBSCRIPTION] Opening customer portal...');
    setLoading(true);
    
    try {
      // Pre-open a blank window to avoid popup blockers
      const popupWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      // Check if popup was blocked
      if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined') {
        console.log('[SUBSCRIPTION] Popup blocked, using fallback method');
        
        // Get the portal URL first
        const data = await apiOpenCustomerPortal();
        
        if (data?.url) {
          // Show toast with direct link as fallback - use a simpler approach
          showToast(
            "Popup Blocked",
            `Your browser blocked the popup. Click here to open billing portal: ${data.url}`,
            "default"
          );
          
          // Also provide a direct redirect option after a short delay
          setTimeout(() => {
            if (confirm('Would you like to open the billing portal now?')) {
              window.location.href = data.url;
            }
          }, 1000);
        } else {
          throw new Error('No portal URL received');
        }
      } else {
        // Popup opened successfully, now get the URL and redirect
        const data = await apiOpenCustomerPortal();
        
        if (data?.url) {
          console.log('[SUBSCRIPTION] Redirecting popup to customer portal');
          popupWindow.location.href = data.url;
          
          // Show success message
          showToast(
            "Portal Opened",
            "Billing portal opened in new window"
          );
        } else {
          // Close the blank popup if we can't get the URL
          popupWindow.close();
          throw new Error('No portal URL received');
        }
      }
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error opening customer portal:', error);
      
      let errorMessage = "Failed to open customer portal";
      if (error.message?.includes('Authentication')) {
        errorMessage = "Your session has expired. Please sign in again.";
      } else if (error.message?.includes('No Stripe customer')) {
        errorMessage = "No subscription found. Please subscribe first.";
      }
      
      showToast(
        "Portal Error",
        errorMessage,
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    openCustomerPortal,
  };
};
