
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
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Account & Subscription</h1>
            <p className="text-gray-400">Manage your account, billing, and subscription settings</p>
          </div>
          <Button
            onClick={handleRefreshSubscription}
            disabled={refreshing}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Account Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan Card */}
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getTierColor(subscription.tier)} flex items-center justify-center`}>
                  <TierIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white capitalize">
                    {subscription.tier} Plan
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={subscription.isActive ? "default" : "secondary"}
                      className={subscription.isActive ? "bg-green-600" : ""}
                    >
                      {subscription.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {subscription.tier !== 'starter' && (
                      <Badge variant="outline" className="border-purple-400/50 text-purple-300">
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
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Billing
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              )}
            </div>

            <Separator className="bg-white/10 mb-6" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Account Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  {subscription.expiresAt && (
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="w-4 h-4 text-gray-400" />
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
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Billing Cycle</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white">
                      <CreditCard className="w-4 h-4 text-gray-400" />
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
          <Card className="bg-slate-900/40 border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {subscription.tier === 'starter' && (
                <>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Creator
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
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
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Update Payment Method
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </Card>

          {/* Support Card */}
          <Card className="bg-slate-900/40 border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Have questions about your subscription or billing?
            </p>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
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
