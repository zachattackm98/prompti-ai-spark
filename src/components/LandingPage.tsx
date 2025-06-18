
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import Header from './landing/Header';
import Hero from './landing/Hero';
import SocialProof from './landing/SocialProof';
import Benefits from './landing/Benefits';
import Process from './landing/Process';
import Features from './landing/Features';
import Testimonials from './landing/Testimonials';
import Pricing from './landing/Pricing';
import FAQ from './landing/FAQ';
import FinalCTA from './landing/FinalCTA';
import PopularResources from './landing/PopularResources';
import Footer from './landing/Footer';
import CinematicPromptGenerator from './CinematicPromptGenerator';
import SubscriberWelcome from './landing/SubscriberWelcome';

const LandingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();

  // Memoize subscription status to prevent unnecessary re-renders
  const subscriptionStatus = useMemo(() => {
    // If we have cached subscription data, use it while loading
    if (subscriptionLoading && user) {
      const cachedData = localStorage.getItem('subscription_cache');
      if (cachedData) {
        try {
          const cached = JSON.parse(cachedData);
          const cacheAge = Date.now() - cached.timestamp;
          // Use cache if less than 5 minutes old
          if (cacheAge < 5 * 60 * 1000) {
            return {
              tier: cached.tier,
              isActive: cached.isActive,
              isCancelling: cached.isCancelling || false,
              expiresAt: cached.expiresAt,
            };
          }
        } catch (e) {
          console.warn('[LANDING] Failed to parse cached subscription data');
        }
      }
    }
    
    return subscription;
  }, [subscription, subscriptionLoading, user]);

  // Only show loading for critical states
  const shouldShowLoading = useMemo(() => {
    return authLoading || (user && subscriptionLoading && !subscriptionStatus);
  }, [authLoading, user, subscriptionLoading, subscriptionStatus]);

  // Check if user has an active paid subscription
  const hasActivePaidSubscription = useMemo(() => {
    return user && subscriptionStatus?.isActive && 
      (subscriptionStatus.tier === 'creator' || subscriptionStatus.tier === 'studio');
  }, [user, subscriptionStatus]);

  // Show loading state only when absolutely necessary
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {hasActivePaidSubscription ? (
        // Simplified view for paid subscribers
        <>
          <SubscriberWelcome user={user} subscription={subscriptionStatus} />
          <Process />
          <CinematicPromptGenerator />
          <Pricing />
          <FAQ />
          <Footer />
        </>
      ) : (
        // Full landing page for non-logged-in users and free tier users
        <>
          {user && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/20 border-b border-green-500/30 py-3 pt-20 sm:pt-24"
            >
              <div className="container mx-auto px-4 text-center">
                <p className="text-green-300 font-medium">
                  Welcome back! Ready to create amazing video prompts?
                </p>
              </div>
            </motion.div>
          )}
          <Hero />
          <SocialProof />
          <Benefits />
          <Process />
          <Features />
          <CinematicPromptGenerator />
          <Testimonials />
          <Pricing />
          <FAQ />
          <FinalCTA />
          <PopularResources />
          <Footer />
        </>
      )}
    </div>
  );
};

export default LandingPage;
