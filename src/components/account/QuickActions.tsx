
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, CreditCard, Download } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const QuickActions = () => {
  const { subscription, openCustomerPortal, loading } = useSubscription();

  return (
    <Card className="bg-slate-900/70 border border-white/20 p-4 sm:p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {subscription.tier === 'starter' && (
          <>
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Creator
            </Button>
            <Button 
              variant="outline"
              className="w-full border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Pricing
            </Button>
          </>
        )}
        
        {subscription.tier !== 'starter' && (
          <Button
            onClick={openCustomerPortal}
            disabled={loading}
            variant="outline"
            className="w-full border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Invoice
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;
