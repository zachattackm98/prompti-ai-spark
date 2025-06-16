
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Calendar, 
  CreditCard,
  Receipt,
  RefreshCw
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { BillingData } from '@/hooks/subscription/billingOperations';

const BillingHistory = () => {
  const { subscription, fetchBillingData, downloadInvoice, loading } = useSubscription();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load billing data on mount if user has a subscription
  useEffect(() => {
    if (subscription.tier !== 'starter') {
      loadBillingData();
    }
  }, [subscription.tier]);

  const loadBillingData = async () => {
    setRefreshing(true);
    try {
      const data = await fetchBillingData();
      setBillingData(data);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string, downloadUrl: string) => {
    await downloadInvoice(invoiceId, downloadUrl);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-600 hover:bg-green-700';
      case 'pending':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'failed':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  if (subscription.tier === 'starter') {
    return (
      <Card className="bg-slate-900/50 border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Receipt className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-white">Billing History</h3>
        </div>
        <div className="text-center py-6 sm:py-8">
          <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-white font-medium mb-2">No Billing History</h4>
          <p className="text-gray-400 text-sm">
            You're currently on the free Starter plan. Upgrade to see your billing history.
          </p>
        </div>
      </Card>
    );
  }

  const invoices = billingData?.invoices || [];

  return (
    <Card className="bg-slate-900/50 border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <Receipt className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-white">Billing History</h3>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-white/20 text-gray-300 w-fit">
            {invoices.length} invoices
          </Badge>
          <Button
            onClick={loadBillingData}
            disabled={refreshing || loading}
            size="sm"
            variant="outline"
            className="border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {refreshing && invoices.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">
          Loading billing history...
        </div>
      ) : invoices.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {invoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-white/5"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <span className="text-white font-medium text-sm sm:text-base truncate">
                      {invoice.description}
                    </span>
                    <Badge className={`${getStatusColor(invoice.status)} text-white text-xs px-2 py-0.5 w-fit`}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {invoice.date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {invoice.invoiceNumber && (
                      <span className="ml-2">• #{invoice.invoiceNumber}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <span className="text-white font-semibold text-sm sm:text-base">
                  ${invoice.amount.toFixed(2)} {invoice.currency}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm text-xs sm:text-sm"
                  onClick={() => handleDownloadInvoice(invoice.id, invoice.downloadUrl)}
                  disabled={loading}
                >
                  <Download className="w-3 h-3 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-400 text-sm">
          No billing history available yet.
        </div>
      )}
    </Card>
  );
};

export default BillingHistory;
