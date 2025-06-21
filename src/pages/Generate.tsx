
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import CinematicPromptGenerator from '@/components/CinematicPromptGenerator';
import Footer from '@/components/landing/Footer';

const Generate = () => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();

  // Show loading state during initial load
  const isInitialLoading = authLoading || (user && subscriptionLoading);

  if (isInitialLoading) {
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Hero user={user} subscription={subscription} showPersonalized={false} />
        <CinematicPromptGenerator />
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Generate;
