
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Calendar, 
  CreditCard,
  Receipt
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const BillingHistory = () => {
  const { subscription } = useSubscription();

  // Mock billing history - in a real app, this would come from Stripe API
  const billingHistory = subscription.tier !== 'starter' ? [
    {
      id: 'inv_001',
      date: new Date(2024, 11, 15),
      amount: subscription.tier === 'creator' ? 19.00 : 49.00,
      status: 'paid',
      description: `${subscription.tier} Plan - Monthly`,
      downloadUrl: '#'
    },
    {
      id: 'inv_002',
      date: new Date(2024, 10, 15),
      amount: subscription.tier === 'creator' ? 19.00 : 49.00,
      status: 'paid',
      description: `${subscription.tier} Plan - Monthly`,
      downloadUrl: '#'
    },
    {
      id: 'inv_003',
      date: new Date(2024, 9, 15),
      amount: subscription.tier === 'creator' ? 19.00 : 49.00,
      status: 'paid',
      description: `${subscription.tier} Plan - Monthly`,
      downloadUrl: '#'
    }
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (subscription.tier === 'starter') {
    return (
      <Card className="bg-slate-900/40 border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Receipt className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Billing History</h3>
        </div>
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-white font-medium mb-2">No Billing History</h4>
          <p className="text-gray-400 text-sm">
            You're currently on the free Starter plan. Upgrade to see your billing history.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/40 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Receipt className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Billing History</h3>
        </div>
        <Badge variant="outline" className="border-white/20 text-gray-300">
          {billingHistory.length} invoices
        </Badge>
      </div>

      <div className="space-y-4">
        {billingHistory.map((invoice) => (
          <div 
            key={invoice.id} 
            className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{invoice.description}</span>
                  <Badge className={`${getStatusColor(invoice.status)} text-white text-xs px-2 py-0.5`}>
                    {invoice.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-400">
                  {invoice.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">
                ${invoice.amount.toFixed(2)}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  // In a real app, this would download the actual invoice
                  console.log('Download invoice:', invoice.id);
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        ))}
      </div>

      {billingHistory.length === 0 && (
        <div className="text-center py-4 text-gray-400">
          No billing history available yet.
        </div>
      )}
    </Card>
  );
};

export default BillingHistory;
