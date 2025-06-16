
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Camera, Lightbulb } from 'lucide-react';
import { cardVariants } from '@/utils/animations';
import { PricingPlan } from './types';

interface PricingPlanCardProps {
  plan: PricingPlan;
  isCurrentPlan: boolean;
  loading: boolean;
  onPlanClick: (plan: PricingPlan) => void;
  getButtonText: (plan: PricingPlan) => string;
}

const PricingPlanCard: React.FC<PricingPlanCardProps> = ({
  plan,
  isCurrentPlan,
  loading,
  onPlanClick,
  getButtonText
}) => {
  return (
    <motion.div
      variants={cardVariants}
      className={`relative bg-slate-900/40 border rounded-2xl p-8 will-change-transform hover:scale-[1.02] transition-all duration-300 ${
        plan.popular 
          ? 'border-purple-500 bg-slate-900/60 md:scale-105' 
          : isCurrentPlan
          ? 'border-green-500 bg-slate-900/60'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Your Plan
          </div>
        </div>
      )}
      
      <div className="text-center mb-8">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
          isCurrentPlan 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
            : 'bg-gradient-to-r from-purple-500 to-pink-500'
        }`}>
          <plan.icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-gray-400 mb-4">{plan.description}</p>
        <div className="flex items-end justify-center">
          <span className="text-4xl font-bold text-white">{plan.price}</span>
          {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
        </div>
      </div>
      
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start text-gray-300">
            <div className="flex-shrink-0 mt-0.5">
              {feature.includes('camera controls') ? (
                <Camera className="w-4 h-4 text-purple-400 mr-3" />
              ) : feature.includes('lighting') ? (
                <Lightbulb className="w-4 h-4 text-yellow-400 mr-3" />
              ) : (
                <Check className="w-4 h-4 text-green-400 mr-3" />
              )}
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        onClick={() => onPlanClick(plan)}
        disabled={loading}
        className={`w-full transition-all duration-300 ${
          isCurrentPlan
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            : plan.popular 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
            : 'bg-slate-800 border border-white/20 hover:bg-slate-700'
        }`}
        size="lg"
      >
        {loading ? 'Processing...' : getButtonText(plan)}
      </Button>
    </motion.div>
  );
};

export default PricingPlanCard;
