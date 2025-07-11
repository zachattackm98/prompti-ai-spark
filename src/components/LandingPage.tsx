
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


const LandingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();

  // Don't render subscription-dependent content until both auth and subscription are loaded
  const isInitialLoading = authLoading || (user && subscriptionLoading);

  // Show loading state during initial load to prevent flicker
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
      
      <Hero user={user} subscription={subscription} />
      <SocialProof />
      <Benefits />
      <Process />
      
      {/* Prompt Generator for unauthenticated users */}
      {!user && (
        <section id="generator" className="py-16">
          <CinematicPromptGenerator />
        </section>
      )}
      
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <PopularResources />
      <Footer />
    </div>
  );
};

export default LandingPage;
