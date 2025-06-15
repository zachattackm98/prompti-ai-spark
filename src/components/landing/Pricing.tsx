
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Crown, Rocket } from 'lucide-react';

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

  return (
    <section id="pricing" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Creative Journey
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start free, upgrade when you're ready to unlock your full creative potential.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 ${
                plan.popular 
                  ? 'border-purple-500 bg-white/10 scale-105' 
                  : 'border-white/10'
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
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
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
