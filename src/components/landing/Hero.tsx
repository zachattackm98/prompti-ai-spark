
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Video } from 'lucide-react';
import { fadeInVariants, staggerContainer, scaleInVariants } from '@/utils/animations';

const Hero = () => {
  const handleScrollToGenerator = () => {
    const generatorSection = document.getElementById('cinematic-generator');
    if (generatorSection) {
      generatorSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            variants={scaleInVariants}
            className="inline-flex items-center space-x-2 bg-slate-900/80 border border-purple-500/20 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8 will-change-transform text-xs sm:text-sm"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-gray-300">Transform ideas into cinematic prompts</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInVariants}
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            Turn Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Vision </span>
            Into Video Magic
          </motion.h1>
          
          <motion.p 
            variants={fadeInVariants}
            className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Generate professional, cinematic prompts for Sora, Runway, Pika, and Veo. 
            From simple ideas to structured masterpieces in seconds.
          </motion.p>
          
          <motion.div 
            variants={fadeInVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0"
          >
            <Button 
              size="lg" 
              onClick={handleScrollToGenerator}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 transition-all duration-300"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Build My First Prompt
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 transition-all duration-300"
            >
              <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div 
            variants={fadeInVariants}
            className="mt-12 sm:mt-16 relative px-4 sm:px-0"
          >
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-8 max-w-3xl mx-auto backdrop-blur-sm">
              <div className="bg-gray-900/70 rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm">
                <div className="text-purple-400 mb-2">// Generated Prompt</div>
                <div className="text-gray-300 leading-relaxed space-y-1">
                  <div><span className="text-pink-400">SHOT:</span> Wide cinematic establishing shot</div>
                  <div><span className="text-pink-400">SCENE:</span> A lone astronaut walking across a vast alien desert at golden hour</div>
                  <div><span className="text-pink-400">MOOD:</span> Epic, contemplative, mysterious</div>
                  <div><span className="text-pink-400">STYLE:</span> Denis Villeneuve aesthetic, 35mm film grain</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
