
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import SubscriptionStats from './SubscriptionStats';
import BillingHistory from './BillingHistory';
import UsageOverview from './UsageOverview';
import CurrentPlanCard from './CurrentPlanCard';
import QuickActions from './QuickActions';
import SupportCard from './SupportCard';

const AccountPage = () => {
  const { user } = useAuth();
  const { verifySubscriptionStatus } = useSubscription();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshSubscription = async () => {
    setRefreshing(true);
    try {
      await verifySubscriptionStatus();
      toast({
        title: "Subscription Updated",
        description: "Your subscription status has been refreshed from Stripe.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh subscription status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm: text-3xl font-bold text-white mb-2">Account & Subscription</h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your account, billing, and subscription settings</p>
          </div>
          <Button
            onClick={handleRefreshSubscription}
            disabled={refreshing}
            variant="outline"
            className="border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking...' : 'Refresh Status'}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Account Info */}
        <div className="xl:col-span-2 space-y-6">
          {/* Current Plan Card */}
          <CurrentPlanCard />

          {/* Usage Overview */}
          <UsageOverview />

          {/* Billing History */}
          <BillingHistory />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Stats */}
          <SubscriptionStats />

          {/* Quick Actions */}
          <QuickActions />

          {/* Support Card */}
          <SupportCard />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
