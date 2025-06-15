
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Video } from 'lucide-react';
import { fadeInVariants, staggerContainer, scaleInVariants, viewportOptions } from '@/utils/animations';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            variants={scaleInVariants}
            className="inline-flex items-center space-x-2 bg-slate-900/80 border border-purple-500/20 rounded-full px-4 py-2 mb-8 will-change-transform"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Transform ideas into cinematic prompts</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInVariants}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight will-change-transform"
          >
            Turn Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Vision </span>
            Into Video Magic
          </motion.h1>
          
          <motion.p 
            variants={fadeInVariants}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Generate professional, cinematic prompts for Sora, Runway, Pika, and Veo. 
            From simple ideas to structured masterpieces in seconds.
          </motion.p>
          
          <motion.div 
            variants={fadeInVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center will-change-transform"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Build My First Prompt
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 transition-all duration-300"
            >
              <Video className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div 
            variants={fadeInVariants}
            className="mt-16 relative will-change-transform"
          >
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto backdrop-blur-sm">
              <div className="bg-gray-900/70 rounded-xl p-6 font-mono text-sm">
                <div className="text-purple-400 mb-2">// Generated Prompt</div>
                <div className="text-gray-300 leading-relaxed">
                  <span className="text-pink-400">SHOT:</span> Wide cinematic establishing shot<br/>
                  <span className="text-pink-400">SCENE:</span> A lone astronaut walking across a vast alien desert at golden hour<br/>
                  <span className="text-pink-400">MOOD:</span> Epic, contemplative, mysterious<br/>
                  <span className="text-pink-400">STYLE:</span> Denis Villeneuve aesthetic, 35mm film grain
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
