
import React from 'react';
import { motion } from 'framer-motion';

const SocialProof = () => {
  const logos = [
    { name: 'Runway', logo: '🎬' },
    { name: 'Sora', logo: '🌟' },
    { name: 'Pika', logo: '⚡' },
    { name: 'Veo', logo: '🎥' },
    { name: 'Gen-2', logo: '🚀' }
  ];

  return (
    <section className="py-16 px-6 border-y border-white/10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 mb-8">Works perfectly with your favorite AI video platforms</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-2xl">{item.logo}</span>
                <span className="text-lg font-medium">{item.name}</span>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 inline-block"
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
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
