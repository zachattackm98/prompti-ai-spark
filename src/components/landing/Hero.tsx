
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Video } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Transform ideas into cinematic prompts</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Vision </span>
            Into Video Magic
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate professional, cinematic prompts for Sora, Runway, Pika, and Veo. 
            From simple ideas to structured masterpieces in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6"
            >
              <Play className="w-5 h-5 mr-2" />
              Build My First Prompt
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Video className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="bg-gray-900/50 rounded-xl p-6 font-mono text-sm">
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
