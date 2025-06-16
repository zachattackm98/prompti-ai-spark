
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { fadeInVariants, scaleInVariants, viewportOptions } from '@/utils/animations';

const FinalCTA = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/20 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-slate-900/60 rounded-3xl"></div>
          
          <div className="relative z-10">
            <motion.div
              variants={scaleInVariants}
              className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            
            <motion.h2 
              variants={fadeInVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6"
            >
              Ready to Create Cinematic Magic?
            </motion.h2>
            
            <motion.p 
              variants={fadeInVariants}
              className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto"
            >
              Join thousands of creators who've transformed their video content with AiPromptMachine. 
              Start for free today and see the difference professional prompts make.
            </motion.p>
            
            <motion.div 
              variants={fadeInVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 transition-all duration-300"
              >
                Start For Free
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 transition-all duration-300"
              >
                Watch Demo Video
              </Button>
            </motion.div>
            
            <motion.p 
              variants={fadeInVariants}
              className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6"
            >
              No credit card required • Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
