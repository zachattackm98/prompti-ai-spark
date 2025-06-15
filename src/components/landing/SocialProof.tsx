
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants, staggerContainer, viewportOptions, animationConfig } from '@/utils/animations';

const SocialProof = () => {
  const logos = [
    { name: 'Runway', logo: '🎬' },
    { name: 'Sora', logo: '🌟' },
    { name: 'Pika', logo: '⚡' },
    { name: 'Veo', logo: '🎥' },
    { name: 'Gen-2', logo: '🚀' }
  ];

  const logoVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: animationConfig
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: animationConfig
    }
  };

  return (
    <section className="py-16 px-6 border-y border-white/10">
      <div className="container mx-auto">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="text-center"
        >
          <p className="text-gray-400 mb-8">Works perfectly with your favorite AI video platforms</p>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          >
            {logos.map((item, index) => (
              <motion.div
                key={item.name}
                variants={logoVariants}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 will-change-transform"
              >
                <span className="text-2xl">{item.logo}</span>
                <span className="text-lg font-medium">{item.name}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            variants={fadeInVariants}
            className="mt-12 bg-slate-900/60 border border-white/10 rounded-full px-6 py-3 inline-block"
          >
            <span className="text-purple-400 font-medium">10,000+ prompts generated</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-300">Trusted by creators worldwide</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
