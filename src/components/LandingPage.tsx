
import React from 'react';
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
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Check if user has an active paid subscription
  const hasActivePaidSubscription = user && subscription?.isActive && 
    (subscription.tier === 'creator' || subscription.tier === 'studio');

  // Debug logging
  console.log('[LANDING] User:', user?.email || 'not logged in');
  console.log('[LANDING] Subscription:', subscription);
  console.log('[LANDING] Has active paid subscription:', hasActivePaidSubscription);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {hasActivePaidSubscription ? (
        // Simplified view for paid subscribers - BENEFITS SECTION COMPLETELY REMOVED
        <>
          <SubscriberWelcome user={user} subscription={subscription} />
          <Process />
          <Features />
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
              className="bg-green-500/20 border-b border-green-500/30 py-3"
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
