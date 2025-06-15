
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Create Cinematic Magic?
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who've transformed their video content with Prompti.ai. 
            Start your free trial today and see the difference professional prompts make.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Watch Demo Video
            </Button>
          </div>
          
          <p className="text-gray-400 text-sm mt-6">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
