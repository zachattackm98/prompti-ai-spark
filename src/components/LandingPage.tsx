
import React from 'react';
import { motion } from 'framer-motion';
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
import ChatGPT from './ChatGPT';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <Hero />
      <SocialProof />
      <Benefits />
      <Process />
      <Features />
      <ChatGPT />
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
