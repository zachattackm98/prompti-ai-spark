
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, User, Settings, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import AccountDetails from './AccountDetails';
import BillingCycle from './BillingCycle';

const CurrentPlanCard = () => {
  const { user } = useAuth();
  const { subscription, openCustomerPortal, loading } = useSubscription();

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'creator':
        return 'from-purple-500 to-pink-500';
      case 'studio':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'creator':
      case 'studio':
        return Crown;
      default:
        return User;
    }
  };

  const TierIcon = getTierIcon(subscription.tier);

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/70 border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${getTierColor(subscription.tier)} flex items-center justify-center flex-shrink-0`}>
            <TierIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-white capitalize">
              {subscription.tier} Plan
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge 
                variant={subscription.isActive ? "default" : "secondary"}
                className={`${subscription.isActive ? "bg-green-600 hover:bg-green-700" : ""} text-xs`}
              >
                {subscription.isActive ? "Active" : "Inactive"}
              </Badge>
              {subscription.tier !== 'starter' && (
                <Badge variant="outline" className="border-purple-400/50 text-purple-300 text-xs">
                  Premium Features
                </Badge>
              )}
            </div>
          </div>
        </div>
        {subscription.isActive && subscription.tier !== 'starter' && (
          <Button
            onClick={openCustomerPortal}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-full sm:w-auto flex-shrink-0"
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Manage Billing</span>
            <span className="sm:hidden">Billing</span>
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        )}
      </div>

      <Separator className="bg-white/10 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <AccountDetails user={user} subscription={subscription} />
        {subscription.tier !== 'starter' && (
          <BillingCycle subscription={subscription} />
        )}
      </div>
    </Card>
  );
};

export default CurrentPlanCard;
