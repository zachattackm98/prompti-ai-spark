
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { fadeInVariants, scaleInVariants, viewportOptions } from '@/utils/animations';

const FinalCTA = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/20 rounded-3xl p-12 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-slate-900/60 rounded-3xl"></div>
          
          <div className="relative z-10">
            <motion.div
              variants={scaleInVariants}
              className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h2 
              variants={fadeInVariants}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Create Cinematic Magic?
            </motion.h2>
            
            <motion.p 
              variants={fadeInVariants}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of creators who've transformed their video content with AiPromptMachine. 
              Start your free trial today and see the difference professional prompts make.
            </motion.p>
            
            <motion.div 
              variants={fadeInVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6 transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white text-lg px-8 py-6 transition-all duration-300"
              >
                Watch Demo Video
              </Button>
            </motion.div>
            
            <motion.p 
              variants={fadeInVariants}
              className="text-gray-400 text-sm mt-6"
            >
              No credit card required • 7-day free trial • Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
