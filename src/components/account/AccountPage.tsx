
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Crown, 
  Calendar, 
  CreditCard, 
  Settings, 
  Download,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SubscriptionStats from './SubscriptionStats';
import BillingHistory from './BillingHistory';
import UsageOverview from './UsageOverview';

const AccountPage = () => {
  const { user } = useAuth();
  const { subscription, checkSubscription, openCustomerPortal, loading } = useSubscription();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshSubscription = async () => {
    setRefreshing(true);
    try {
      await checkSubscription();
      toast({
        title: "Subscription Updated",
        description: "Your subscription status has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh subscription status.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Account & Subscription</h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your account, billing, and subscription settings</p>
          </div>
          <Button
            onClick={handleRefreshSubscription}
            disabled={refreshing}
            variant="outline"
            className="border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Account Info */}
        <div className="xl:col-span-2 space-y-6">
          {/* Current Plan Card */}
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
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Account Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm truncate">{user?.email}</span>
                  </div>
                  {subscription.expiresAt && (
                    <div className="flex items-start gap-2 text-white">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">
                        Renews {new Date(subscription.expiresAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {subscription.tier !== 'starter' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Billing Cycle</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white">
                      <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">Monthly Billing</span>
                    </div>
                    {subscription.expiresAt && (
                      <div className="text-xs text-gray-400">
                        Next billing: {new Date(subscription.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

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

          {/* Support Card */}
          <Card className="bg-slate-900/70 border border-white/20 p-4 sm:p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Have questions about your subscription or billing?
            </p>
            <Button
              variant="outline"
              className="w-full border-purple-500/30 text-white hover:bg-purple-500/20 bg-slate-800/80 backdrop-blur-sm"
              onClick={() => window.open('mailto:support@prompti.ai', '_blank')}
            >
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
