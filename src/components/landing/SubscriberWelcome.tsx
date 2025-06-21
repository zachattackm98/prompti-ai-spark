
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { fadeInVariants, scaleInVariants } from '@/utils/animations';

interface SubscriberWelcomeProps {
  user: User;
  subscription: {
    tier: string;
    isActive: boolean;
  } | null;
}

const SubscriberWelcome: React.FC<SubscriberWelcomeProps> = ({ user, subscription }) => {
  const tierDisplayNames = {
    creator: 'Creator',
    studio: 'Studio'
  };

  // Fallback to 'creator' if subscription is somehow null (shouldn't happen but safety first)
  const tier = subscription?.tier || 'creator';
  const tierName = tierDisplayNames[tier as keyof typeof tierDisplayNames] || tier;

  return (
    <section className="pt-24 pb-12 px-6">
      <div className="container mx-auto text-center">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            variants={scaleInVariants}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">{tierName} Plan Active</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInVariants}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Welcome Back,
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Creator</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInVariants}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Your AI prompt generator is ready. Create professional, cinematic prompts for all your video projects.
          </motion.p>

          <motion.div 
            variants={fadeInVariants}
            className="flex items-center justify-center gap-8 mb-12"
          >
            <div className="flex items-center gap-2 text-green-400">
              <Zap className="w-5 h-5" />
              <span className="font-medium">High Prompt Limits</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">All Styles Unlocked</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Priority Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SubscriberWelcome;
