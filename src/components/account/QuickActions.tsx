
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, CreditCard, Download } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const { subscription, openCustomerPortal, fetchBillingData, loading } = useSubscription();
  const navigate = useNavigate();

  const handleManageBilling = async () => {
    await openCustomerPortal();
  };

  const handleDownloadLatestInvoice = async () => {
    try {
      const billingData = await fetchBillingData();
      if (billingData && billingData.invoices.length > 0) {
        const latestInvoice = billingData.invoices[0]; // Most recent invoice
        if (latestInvoice.downloadUrl) {
          window.open(latestInvoice.downloadUrl, '_blank');
        } else {
          throw new Error('No download URL available');
        }
      } else {
        throw new Error('No invoices found');
      }
    } catch (error) {
      console.error('Error downloading latest invoice:', error);
      // Error handling is done in the fetchBillingData function
    }
  };

  const handleViewPricing = () => {
    navigate('/');
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleUpgradeToCreator = () => {
    navigate('/');
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <Card className="bg-slate-900/70 border border-white/20 p-4 sm:p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {subscription.tier === 'starter' && (
          <>
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              onClick={handleUpgradeToCreator}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Creator
            </Button>
            <Button 
              variant="outline"
              className="w-full border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm"
              onClick={handleViewPricing}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Pricing
            </Button>
          </>
        )}
        
        {subscription.tier !== 'starter' && (
          <>
            <Button
              onClick={handleManageBilling}
              disabled={loading}
              variant="outline"
              className="w-full border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? 'Opening...' : 'Manage Billing'}
            </Button>

            <Button
              onClick={handleDownloadLatestInvoice}
              disabled={loading}
              variant="outline"
              className="w-full border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : 'Download Latest Invoice'}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default QuickActions;
