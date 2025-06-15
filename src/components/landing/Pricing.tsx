
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Crown, Rocket } from 'lucide-react';
import { fadeInVariants, staggerContainer, viewportOptions } from '@/utils/animations';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      icon: Sparkles,
      price: "Free",
      description: "Perfect for trying out Prompti.ai",
      features: [
        "5 prompts per month",
        "Basic style options",
        "Standard video platforms",
        "Email support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Creator",
      icon: Crown,
      price: "$19",
      period: "/month",
      description: "For serious content creators",
      features: [
        "Unlimited prompts",
        "50+ cinematic styles", 
        "All video platforms",
        "Priority support",
        "Custom style creation",
        "Batch processing"
      ],
      cta: "Start Creating",
      popular: true
    },
    {
      name: "Studio",
      icon: Rocket,
      price: "$49",
      period: "/month",
      description: "For teams and agencies",
      features: [
        "Everything in Creator",
        "Team collaboration",
        "Brand style guides",
        "API access",
        "White-label options",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }
    }
  };

  return (
    <section id="pricing" className="py-20 px-6">
      <div className="container mx-auto">
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
            Start free, upgrade when you're ready to unlock your full creative potential.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={`relative bg-slate-900/40 border rounded-2xl p-8 will-change-transform hover:scale-[1.02] transition-all duration-300 ${
                plan.popular 
                  ? 'border-purple-500 bg-slate-900/60 md:scale-105' 
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
              
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                  <li key={i} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                    : 'bg-slate-800 border border-white/20 hover:bg-slate-700'
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
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
