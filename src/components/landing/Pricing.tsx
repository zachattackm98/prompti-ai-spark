
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants, staggerContainer, viewportOptions } from '@/utils/animations';
import { pricingPlans } from './pricing/pricingData';
import { usePricingLogic } from './pricing/usePricingLogic';
import PricingHeader from './pricing/PricingHeader';
import PricingPlanCard from './pricing/PricingPlanCard';

const Pricing = () => {
  const {
    user,
    subscription,
    loading,
    handlePlanClick,
    getButtonText,
    isCurrentPlan
  } = usePricingLogic();

  return (
    <section id="pricing" className="py-20 px-6">
      <div className="container mx-auto">
        <PricingHeader user={user} subscription={subscription} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {pricingPlans.map((plan) => (
            <PricingPlanCard
              key={plan.name}
              plan={plan}
              isCurrentPlan={isCurrentPlan(plan.tier)}
              loading={loading}
              onPlanClick={handlePlanClick}
              getButtonText={getButtonText}
            />
          ))}
        </motion.div>
        
        <motion.div 
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="text-center mt-12"
        >
          <p className="text-gray-400">
            All plans include 7-day free trial • No credit card required • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
