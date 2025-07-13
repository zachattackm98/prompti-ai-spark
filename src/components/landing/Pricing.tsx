import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/utils/animations';
import PricingHeader from './pricing/PricingHeader';
import PricingPlanCard from './pricing/PricingPlanCard';
import { usePricingLogic } from './pricing/usePricingLogic';
import { pricingPlans } from './pricing/pricingData';
import AuthDialog from '@/components/AuthDialog';
const Pricing = () => {
  const {
    user,
    subscription,
    loading,
    handlePlanClick,
    getButtonText,
    isCurrentPlan,
    showAuthDialog,
    setShowAuthDialog
  } = usePricingLogic();
  return <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <PricingHeader user={user} subscription={subscription} />
        
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{
        once: true
      }} className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => <PricingPlanCard key={plan.tier} plan={plan} isCurrentPlan={isCurrentPlan(plan.tier)} loading={loading} onPlanClick={handlePlanClick} getButtonText={getButtonText} />)}
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.4
      }} className="text-center">
          <p className="text-gray-400 mb-4">
            All plans include our core AI prompt generation features
          </p>
          <p className="text-sm text-gray-500">No hidden fees • Cancel anytime</p>
        </motion.div>
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </section>;
};
export default Pricing;