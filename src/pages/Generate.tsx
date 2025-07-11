
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import CinematicPromptGenerator from '@/components/CinematicPromptGenerator';
import Footer from '@/components/landing/Footer';

const Generate = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const subscriptionContext = useSubscription();
  const { subscription, loading: subscriptionLoading } = subscriptionContext;
  const [showHistory, setShowHistory] = useState(false);
  const location = useLocation();

  // Show loading state during initial load
  const isInitialLoading = authLoading || (user && subscriptionLoading);

  // Auto-scroll to generator when coming from landing page
  useEffect(() => {
    if (!isInitialLoading && location.state?.scrollToGenerator) {
      setTimeout(() => {
        const generatorElement = document.getElementById('generator-start');
        if (generatorElement) {
          generatorElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300); // Small delay to ensure page is fully rendered
    }
  }, [isInitialLoading, location.state]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;
    const upgradeDetails = subscriptionContext.getUpgradeDetails();
    if (!upgradeDetails) return;
    
    try {
      await subscriptionContext.createCheckout(upgradeDetails.targetTier as 'creator' | 'studio');
    } catch (error) {
      console.error('Upgrade error:', error);
    }
  };

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
        <Hero 
          user={user} 
          subscription={subscription} 
          isGeneratePage={true}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          onSignOut={handleSignOut}
          onUpgrade={handleUpgrade}
        />
        <CinematicPromptGenerator 
          showHistory={showHistory} 
          setShowHistory={setShowHistory}
          onSignOut={handleSignOut}
        />
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Generate;
