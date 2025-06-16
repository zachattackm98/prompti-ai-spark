
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants, viewportOptions } from '@/utils/animations';
import { UserSubscription } from '@/types/subscription';

interface PricingHeaderProps {
  user: any;
  subscription: UserSubscription;
}

const PricingHeader: React.FC<PricingHeaderProps> = ({ user, subscription }) => {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        Choose Your Creative Journey
      </h2>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Start free, upgrade when you're ready to unlock professional cinematic features.
      </p>
      {user && subscription && (
        <p className="text-purple-300 mt-4">
          Current Plan: <span className="font-semibold capitalize">{subscription.tier}</span>
          {subscription.isActive && subscription.expiresAt && (
            <span className="text-sm text-gray-400 ml-2">
              (Expires: {new Date(subscription.expiresAt).toLocaleDateString()})
            </span>
          )}
        </p>
      )}
    </motion.div>
  );
};

export default PricingHeader;
