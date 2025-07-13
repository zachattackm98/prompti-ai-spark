
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Camera, Lightbulb, Loader2, Sparkles } from 'lucide-react';
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
  // Check if this plan is being processed (optimistic update)
  const isPending = loading && sessionStorage.getItem('pending_tier') === plan.tier;
  const isOptimistic = sessionStorage.getItem('optimistic_update') === 'true' && 
                       sessionStorage.getItem('pending_tier') === plan.tier;

  // Determine if this is the Studio plan for gold styling
  const isStudioPlan = plan.tier === 'studio';

  // Get mobile-friendly button text
  const getMobileButtonText = (plan: PricingPlan) => {
    const fullText = getButtonText(plan);
    if (plan.tier === 'starter') {
      return {
        mobile: 'Start Free',
        desktop: fullText
      };
    }
    return {
      mobile: fullText,
      desktop: fullText
    };
  };

  const buttonText = getMobileButtonText(plan);

  return (
    <motion.div
      variants={cardVariants}
      className={`relative bg-slate-900/40 border rounded-2xl p-8 will-change-transform hover:scale-[1.02] transition-all duration-300 flex flex-col ${
        isStudioPlan
          ? 'border-yellow-500/50 bg-gradient-to-b from-slate-900/60 to-yellow-900/20'
          : plan.popular 
          ? 'border-purple-500 bg-slate-900/60 md:scale-105' 
          : isCurrentPlan
          ? 'border-green-500 bg-slate-900/60'
          : isPending
          ? 'border-yellow-500 bg-slate-900/60 animate-pulse'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {plan.popular && !isStudioPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}

      {isCurrentPlan && !isPending && (
        <div className="absolute -top-4 right-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Your Plan
          </div>
        </div>
      )}

      {isPending && (
        <div className="absolute -top-4 right-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </div>
        </div>
      )}

      {isOptimistic && !isPending && (
        <div className="absolute -top-4 right-4">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Processing
          </div>
        </div>
      )}
      
      <div className="text-center mb-8">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
          isPending
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
            : isCurrentPlan || isOptimistic
            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
            : isStudioPlan
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
            : 'bg-gradient-to-r from-purple-500 to-pink-500'
        }`}>
          {isPending ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <plan.icon className="w-6 h-6 text-white" />
          )}
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${
          isStudioPlan ? 'text-yellow-300' : 'text-white'
        }`}>{plan.name}</h3>
        <p className="text-gray-400 mb-4">{plan.description}</p>
        <div className="flex items-end justify-center">
          <span className={`text-4xl font-bold ${
            isStudioPlan ? 'text-yellow-300' : 'text-white'
          }`}>{plan.price}</span>
          {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
        </div>
      </div>
      
      <ul className="space-y-4 mb-8 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start text-gray-300">
            <div className="flex-shrink-0 mt-0.5">
              {plan.tier !== 'starter' && feature.includes('camera controls') ? (
                <Camera className="w-4 h-4 text-purple-400 mr-3" />
              ) : plan.tier !== 'starter' && (feature.includes('lighting') || feature.includes('Advanced lighting')) ? (
                <Lightbulb className={`w-4 h-4 mr-3 ${
                  isStudioPlan ? 'text-yellow-400' : 'text-yellow-400'
                }`} />
              ) : (
                <Check className={`w-4 h-4 mr-3 ${
                  isStudioPlan ? 'text-yellow-400' : 'text-green-400'
                }`} />
              )}
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        onClick={() => onPlanClick(plan)}
        disabled={false}
        className={`w-full transition-all duration-300 mt-auto ${
          isPending
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
            : isCurrentPlan || isOptimistic
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            : isStudioPlan
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg shadow-yellow-500/25'
            : plan.popular 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
            : 'bg-gradient-to-r from-slate-800 to-slate-700 border border-white/20 hover:from-slate-700 hover:to-slate-600'
        }`}
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <span className="hidden sm:inline">{buttonText.desktop}</span>
            <span className="sm:hidden">{buttonText.mobile}</span>
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default PricingPlanCard;
